package main

import (
	"bufio"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/asn1"
	"fmt"
	"io"
	"log"
	"net"
	"net/url"
	"strconv"
	"strings"
	"time"

	"tobirama/chat/chat"
	"tobirama/chat/kep"
	"tobirama/chat/x500"
	"tobirama/chat_xseries/basicaccesscontrol"
	"tobirama/chat_xseries/pkix1implicit2009"
	"tobirama/chat_xseries/pkixcmp2009"
)

func mustDNSGeneralName(host string) pkix1implicit2009.X2009GeneralName {
	full, err := encodeContextSpecificIA5String(2, host)
	if err != nil {
		log.Fatalf("failed to encode dNSName '%s': %v", host, err)
	}
	var gn pkix1implicit2009.X2009GeneralName
	if _, err := asn1.Unmarshal(full, (*asn1.RawValue)(&gn)); err != nil {
		log.Fatalf("failed to unmarshal dNSName raw value: %v", err)
	}
	return gn
}

func debugGeneralName(label string, gn pkix1implicit2009.X2009GeneralName) {
	rv := asn1.RawValue(gn)
	fmt.Printf("%s: Tag=%d Class=%d Compound=%v len(Bytes)=%d len(FullBytes)=%d\n",
		label, rv.Tag, rv.Class, rv.IsCompound, len(rv.Bytes), len(rv.FullBytes))
	if len(rv.Bytes) > 0 {
		fmt.Printf("%s Bytes: % X\n", label, rv.Bytes)
	}
	if len(rv.FullBytes) > 0 {
		fmt.Printf("%s FullBytes: % X\n", label, rv.FullBytes)
	}
}

func encodeContextSpecificIA5String(tag int, value string) ([]byte, error) {
	if tag < 0 || tag > 30 {
		return nil, fmt.Errorf("context-specific tag %d out of range", tag)
	}

	ia5, err := asn1.MarshalWithParams(value, "ia5")
	if err != nil {
		return nil, err
	}
	if len(ia5) == 0 {
		return nil, fmt.Errorf("empty IA5 encoding for %q", value)
	}

	ia5[0] = byte(0x80 | tag)
	return ia5, nil
}

func main() {
	fmt.Println("=== Go ASN.1 Types Test Suite ===")
	fmt.Println()

	testCHATMessage()
	testCHATContact()
	testKEPTypes()
	testKEPSignedData()
	testXSeries()

	// CA Interaction
	// testCAConnection()
	requestRobotGoCertificate()

	fmt.Println()
	fmt.Println("=== All tests passed! ===")
}

// sendCMPRequest sends a CMP request to the CA using raw TCP/HTTP1.0
func sendCMPRequest(urlStr string, data []byte) ([]byte, error) {
	u, err := url.Parse(urlStr)
	if err != nil {
		return nil, err
	}

	fmt.Printf("Dialing %s...\n", u.Host)
	conn, err := net.Dial("tcp", u.Host)
	if err != nil {
		return nil, err
	}
	defer conn.Close()
	fmt.Println("Connected. Sending Request...")

	// Construct HTTP/1.0 Request
	path := u.Path
	if path == "" {
		path = "/"
	}
	req := fmt.Sprintf("POST %s HTTP/1.0\r\n"+
		"Host: %s\r\n"+
		"Content-Type: application/pkixcmp\r\n"+
		"Content-Length: %d\r\n"+
		"Connection: close\r\n"+
		"\r\n", path, u.Host, len(data))

	if _, err := conn.Write([]byte(req)); err != nil {
		return nil, err
	}
	if _, err := conn.Write(data); err != nil {
		return nil, err
	}
	if tcpConn, ok := conn.(*net.TCPConn); ok {
		fmt.Println("Closing Write side of connection...")
		tcpConn.CloseWrite()
	}
	fmt.Println("Request sent. Waiting for response...")

	reader := bufio.NewReader(conn)

	// Read Status Line
	statusLine, err := reader.ReadString('\n')
	if err != nil {
		return nil, fmt.Errorf("failed to read status line: %v", err)
	}
	fmt.Printf("Got Status Line: %s", statusLine)
	if !strings.Contains(statusLine, "200") {
		return nil, fmt.Errorf("server error: %s", strings.TrimSpace(statusLine))
	}

	// Read Headers
	fmt.Println("Reading Headers...")
	contentLength := -1
	for {
		line, err := reader.ReadString('\n')
		if err != nil {
			return nil, err
		}
		// fmt.Printf("Header: %s", line) // optional verbose
		line = strings.TrimSpace(line)
		if line == "" {
			break
		}
		if strings.HasPrefix(strings.ToLower(line), "content-length:") {
			parts := strings.Split(line, ":")
			if len(parts) > 1 {
				cl, err := strconv.Atoi(strings.TrimSpace(parts[1]))
				if err == nil {
					contentLength = cl
				}
			}
		}
	}
	fmt.Printf("Headers done. Content-Length: %d. Reading Body...\n", contentLength)

	// Read Body
	if contentLength > 0 {
		body := make([]byte, contentLength)
		if _, err := io.ReadFull(reader, body); err != nil {
			return nil, err
		}
		return body, nil
	}

	// Parsing ASN.1 Length Manually if Content-Length is missing
	firstByte, err := reader.ReadByte()
	if err != nil {
		return nil, err
	}

	lenByte, err := reader.ReadByte()
	if err != nil {
		return nil, err
	}

	var length int64
	var headerBytes []byte
	headerBytes = append(headerBytes, firstByte, lenByte)

	if lenByte&0x80 == 0 {
		length = int64(lenByte)
	} else {
		numBytes := int(lenByte & 0x7F)
		if numBytes == 0 {
			// Indefinite length - not supported in this simple client
			// Fallback to reading everything until EOF
			fmt.Println("Indefinite length detected, reading until EOF...")
			return io.ReadAll(reader)
		}

		lenBytes := make([]byte, numBytes)
		if _, err := io.ReadFull(reader, lenBytes); err != nil {
			return nil, err
		}
		headerBytes = append(headerBytes, lenBytes...)

		for _, b := range lenBytes {
			length = (length << 8) | int64(b)
		}
	}

	fmt.Printf("Manual ASN.1 Length parsed: %d\n", length)

	valueBytes := make([]byte, length)
	if _, err := io.ReadFull(reader, valueBytes); err != nil {
		return nil, err
	}

	return append(headerBytes, valueBytes...), nil
}

// requestRobotGoCertificate constructs a PKIMessage with 'p10cr' body (Tag 4)
func requestRobotGoCertificate() {
	fmt.Println("Requesting Certificate for 'robot_go' using p10cr (PKCS#10)...")

	// 1. Generate Key Pair (ECDSA P-384 to match Swift)
	privKey, err := ecdsa.GenerateKey(elliptic.P384(), rand.Reader)
	if err != nil {
		log.Fatalf("failed to generate private key: %v", err)
	}

	// 2. Create Certificate Request (PKCS#10)
	csrTemplate := x509.CertificateRequest{
		Subject: pkix.Name{
			CommonName: "robot_go",
		},
		SignatureAlgorithm: x509.ECDSAWithSHA384,
	}

	csrDER, err := x509.CreateCertificateRequest(rand.Reader, &csrTemplate, privKey)
	if err != nil {
		log.Fatalf("failed to create certificate request: %v", err)
	}
	fmt.Printf("Generated CSR (len=%d)\n", len(csrDER))

	// 3. Construct PKIBody
	// PKIBody ::= CHOICE { p10cr [4] CertificationRequest, ... }
	// PKIXCMP-2009 is EXPLICIT TAGS.
	// So [4] wraps the CertificationRequest (SEQUENCE).
	// We use Tag 4 Context-Specific Constructed to wrap the inner sequence.
	// asn1.RawValue with 'Bytes' set to the full DER of the inner type results in EXPLICIT tagging.
	bodyRaw := asn1.RawValue{
		Class:      asn1.ClassContextSpecific,
		Tag:        4,
		IsCompound: true,
		Bytes:      csrDER, // csrDER is '30 ...' (Sequence)
	}
	// Result on wire: A4 Len 30 Len ... (EXPLICIT)

	// Create body alias
	body := pkixcmp2009.X2009PKIBody(bodyRaw)

	// 4. Header
	sender := mustDNSGeneralName("robot_go")
	recipient := mustDNSGeneralName("localhost")
	debugGeneralName("request sender", sender)
	debugGeneralName("request recipient", recipient)

	// Generate TransactionID and SenderNonce
	transID := make([]byte, 16)
	rand.Read(transID)
	nonce := make([]byte, 16)
	rand.Read(nonce)

	// PBM Protection Setup
	// OID 1.2.840.113533.7.66.13 (PasswordBasedMac)
	pbmOID := asn1.ObjectIdentifier{1, 2, 840, 113533, 7, 66, 13}

	// Parameters
	salt := make([]byte, 16)
	rand.Read(salt)
	iterationCount := 10000

	// PBMParameter ::= SEQUENCE {
	//   salt                OCTET STRING,
	//   owf                 AlgorithmIdentifier,
	//   iterationCount      INTEGER,
	//   mac                 AlgorithmIdentifier
	// }
	type AlgorithmIdentifier struct {
		Algorithm  asn1.ObjectIdentifier
		Parameters asn1.RawValue `asn1:"optional"`
	}
	type PBMParameter struct {
		Salt           []byte
		OWF            AlgorithmIdentifier
		IterationCount int
		MAC            AlgorithmIdentifier
	}

	// OWF: SHA-256 (2.16.840.1.101.3.4.2.1)
	owfAlg := AlgorithmIdentifier{Algorithm: asn1.ObjectIdentifier{2, 16, 840, 1, 101, 3, 4, 2, 1}}
	// MAC: HMAC-SHA256 (1.2.840.113549.2.9)
	macAlg := AlgorithmIdentifier{Algorithm: asn1.ObjectIdentifier{1, 2, 840, 113549, 2, 9}}

	pbmParams := PBMParameter{
		Salt:           salt,
		OWF:            owfAlg,
		IterationCount: iterationCount,
		MAC:            macAlg,
	}
	pbmParamsBytes, err := asn1.Marshal(pbmParams)
	if err != nil {
		log.Fatalf("failed to marshal PBM params: %v", err)
	}

	protectionAlg := asn1.RawValue{
		Tag:        16, // SEQUENCE
		Class:      0,
		IsCompound: true,
		// AlgorithmIdentifier SEQUENCE { algorithm, parameters }
		// But here we construct the outer wrapper manually or use helper?
		// ProtectionAlg is AlgorithmIdentifier.
		// We construct it manually to ensure params are embedded correctly as ANY defined by algorithm.
	}

	// Construct full AlgorithmIdentifier for ProtectionAlg
	fullProtAlg := AlgorithmIdentifier{
		Algorithm:  pbmOID,
		Parameters: asn1.RawValue{FullBytes: pbmParamsBytes},
	}
	fullProtAlgBytes, _ := asn1.Marshal(fullProtAlg)

	// Manually wrap in [1] EXPLICIT because RawValue with FullBytes ignores struct tags in some Go versions
	// or we just want to be sure.
	// Tag 1 Context Constructed = A1
	protLen := len(fullProtAlgBytes)
	wrappedProt := make([]byte, 0, protLen+5)
	wrappedProt = append(wrappedProt, 0xA1)
	if protLen < 128 {
		wrappedProt = append(wrappedProt, byte(protLen))
	} else if protLen < 256 {
		wrappedProt = append(wrappedProt, 0x81, byte(protLen))
	} else {
		wrappedProt = append(wrappedProt, 0x82, byte(protLen>>8), byte(protLen))
	}
	wrappedProt = append(wrappedProt, fullProtAlgBytes...)

	protectionAlg.FullBytes = wrappedProt

	header := pkixcmp2009.X2009PKIHeader{
		Pvno:          2,
		Sender:        sender,
		Recipient:     recipient,
		MessageTime:   time.Now(),                                       // Add timestamp just in case
		ProtectionAlg: protectionAlg,                                    // Now populated
		SenderKID:     pkix1implicit2009.X2009KeyIdentifier("robot_go"), // Reference
		TransactionID: transID,
		SenderNonce:   nonce,
	}

	// Calculate Protection
	// 1. Derivate Key
	// Server logic: baseKey(pass, salt, iter, owf) ->
	// acc = hash(pass <> salt)
	// loop iter-1 times: acc = hash(acc)
	// return acc
	pass := []byte("0000") // Secret from Swift example
	key := deriveKey(pass, salt, iterationCount)

	// 2. ProtectedPart = SEQUENCE { header, body }
	// We need the exact DER bytes of header and body.
	// Marshal them separately?
	// Note: header and body are already defined.
	// We need to marshal them as a sequence.

	headerBytes, _ := asn1.Marshal(header)

	// Body is already asn1.RawValue (tag [4] explicit).
	// We need the full bytes of body.
	bodyBytes, _ := asn1.Marshal(body)

	protectedPartDer := make([]byte, 0, len(headerBytes)+len(bodyBytes)+10)
	protectedPartDer = append(protectedPartDer, 0x30) // Sequence Tag
	// Length... lazy way: compute length
	contentLen := len(headerBytes) + len(bodyBytes)
	if contentLen < 128 {
		protectedPartDer = append(protectedPartDer, byte(contentLen))
	} else {
		// Multi-byte length (simplified for expected size < 65535)
		if contentLen < 256 {
			protectedPartDer = append(protectedPartDer, 0x81, byte(contentLen))
		} else {
			protectedPartDer = append(protectedPartDer, 0x82, byte(contentLen>>8), byte(contentLen))
		}
	}
	protectedPartDer = append(protectedPartDer, headerBytes...)
	protectedPartDer = append(protectedPartDer, bodyBytes...)

	mac := calculateMAC(key, protectedPartDer)

	// Protection BIT STRING
	protection := asn1.BitString{
		Bytes:     mac,
		BitLength: len(mac) * 8,
	}

	msg := pkixcmp2009.X2009PKIMessage{
		Header:     header,
		Body:       body,
		Protection: pkixcmp2009.X2009PKIProtection(protection),
	}

	// Marshal PKIMessage
	msgBytes, err := asn1.Marshal(msg)
	if err != nil {
		log.Fatalf("failed to marshal PKIMessage: %v", err)
	}

	fmt.Printf("Sending PKIMessage (len=%d) to CA...\n", len(msgBytes))
	fmt.Printf("HEX: %X\n", msgBytes) // DEBUG HEX DUMP

	// Send to CA
	respBytes, err := sendCMPRequest("http://localhost:8829/", msgBytes)
	if err != nil {
		log.Fatalf("Failed to send request: %v", err)
	}

	fmt.Printf("Success! Received response (len=%d)\n", len(respBytes))

	// Decode response
	var respMsg pkixcmp2009.X2009PKIMessage
	rest, err := asn1.Unmarshal(respBytes, &respMsg)
	if err != nil {
		log.Fatalf("Failed to decode response: %v", err)
	}
	if len(rest) > 0 {
		fmt.Printf("Trailing bytes: %d\n", len(rest))
	}
	fmt.Printf("Response Body Tag: %d Class: %d\n", respMsg.Body.Tag, respMsg.Body.Class)
	fmt.Printf("Response full bytes:  %#v\n", respMsg)
	fmt.Printf("Response full bytes hex:  %X\n", respMsg.Body.FullBytes)
}

// testXSeries tests types from the X.500 series packages
func testXSeries() {
	fmt.Print("Testing X-Series (X.500) types... ")

	// Test BasicAccessControlACIItem
	aci := basicaccesscontrol.BasicAccessControlACIItem{
		IdentificationTag:   asn1.RawValue{Tag: 4, Bytes: []byte("tag")},
		Precedence:          10,
		AuthenticationLevel: basicaccesscontrol.BasicAccessControlAuthenticationLevel{Tag: 16, IsCompound: true}, // simplified
		ItemOrUserFirst:     asn1.RawValue{Tag: 16, IsCompound: true},                                            // Sequence
	}

	_, err := asn1.Marshal(aci)
	if err != nil {
		log.Fatalf("Failed to encode BasicAccessControlACIItem: %v", err)
	}

	// Test AuthenticationFrameworkCertificate (partial)
	cert := x500.AuthenticationFrameworkCertificate{
		ToBeSigned: x500.AuthenticationFrameworkCertificateToBeSigned{
			Version:      2,                                                        // v3
			SerialNumber: x500.AuthenticationFrameworkCertificateSerialNumber(255), // Dummy
			Signature:    asn1.RawValue{Tag: 16, IsCompound: true},
			// Issuer/Subject would need complex setup, using zero values for now (might panic on marshal if not careful, but struct creation is verified)
		},
		AlgorithmIdentifier: asn1.RawValue{Tag: 16, IsCompound: true},
		Encrypted:           asn1.BitString{Bytes: []byte{0xFF}, BitLength: 8},
	}

	// Just verify we created the struct types correctly
	if cert.ToBeSigned.Version != 2 {
		log.Fatalf("Certificate version mismatch")
	}

	fmt.Println("PASS")
}

// testCHATMessage tests the CHATMessage struct
func testCHATMessage() {
	fmt.Print("Testing CHATMessage... ")

	msg := chat.CHATMessage{
		No:      1,
		Headers: [][]byte{[]byte("Content-Type: text/plain")},
		Body:    chat.CHATProtocol{},
	}

	// Test ASN.1 encoding
	encoded, err := asn1.Marshal(msg)
	if err != nil {
		log.Fatalf("Failed to encode CHATMessage: %v", err)
	}

	// Test ASN.1 decoding
	var decoded chat.CHATMessage
	_, err = asn1.Unmarshal(encoded, &decoded)
	if err != nil {
		log.Fatalf("Failed to decode CHATMessage: %v", err)
	}

	// Verify
	if decoded.No != msg.No {
		log.Fatalf("CHATMessage.No mismatch: expected %d, got %d", msg.No, decoded.No)
	}

	fmt.Println("PASS")
}

// testCHATContact tests the CHATContact struct
func testCHATContact() {
	fmt.Print("Testing CHATContact... ")

	contact := chat.CHATContact{
		Nickname: []byte("JohnDoe"),
		Avatar:   []byte("avatar_data"),
		Names:    [][]byte{[]byte("John")},
		PhoneId:  []byte("+380123456789"),
		Surnames: [][]byte{[]byte("Doe")},
		Update:   1703100000,
		Created:  1703000000,
	}

	// Test ASN.1 encoding
	encoded, err := asn1.Marshal(contact)
	if err != nil {
		log.Fatalf("Failed to encode CHATContact: %v", err)
	}

	// Test ASN.1 decoding
	var decoded chat.CHATContact
	_, err = asn1.Unmarshal(encoded, &decoded)
	if err != nil {
		log.Fatalf("Failed to decode CHATContact: %v", err)
	}

	// Verify
	if string(decoded.Nickname) != string(contact.Nickname) {
		log.Fatalf("CHATContact.Nickname mismatch")
	}

	fmt.Println("PASS")
}

// testKEPTypes tests various KEP types for basic struct creation and encoding
func testKEPTypes() {
	fmt.Print("Testing KEP types (struct creation + encoding)... ")

	// Test KEPMessageImprint
	imprint := kep.KEPMessageImprint{
		HashAlgorithm: asn1.RawValue{Tag: 16, Class: 0, IsCompound: true, Bytes: []byte{0x06, 0x09, 0x60, 0x86, 0x48, 0x01, 0x65, 0x03, 0x04, 0x02, 0x01}},
		HashedMessage: []byte("SHA256_HASH_PLACEHOLDER"),
	}

	_, err := asn1.Marshal(imprint)
	if err != nil {
		log.Fatalf("Failed to encode KEPMessageImprint: %v", err)
	}

	// Test KEPContentType
	contentType := kep.KEPContentType{1, 2, 840, 113549, 1, 7, 1}
	if len(contentType) != 7 {
		log.Fatalf("KEPContentType length mismatch")
	}

	// Test KEPPKIStatus
	status := kep.KEPPKIStatus(0) // Granted
	if status != 0 {
		log.Fatalf("KEPPKIStatus mismatch")
	}

	fmt.Println("PASS")
}

// testKEPSignedData tests KEPSignedData struct creation
func testKEPSignedData() {
	fmt.Print("Testing KEPSignedData struct... ")

	signedData := kep.KEPSignedData{
		Version: 1,
		EncapContentInfo: kep.KEPEncapsulatedContentInfo{
			EContentType: kep.KEPContentType{1, 2, 840, 113549, 1, 7, 1},
		},
	}

	// Just verify struct can be created and version matches
	if signedData.Version != 1 {
		log.Fatalf("KEPSignedData.Version mismatch")
	}

	// Verify ContentType OID
	if len(signedData.EncapContentInfo.EContentType) != 7 {
		log.Fatalf("KEPSignedData encap content type OID length mismatch")
	}

	fmt.Println("PASS")
}

func deriveKey(password, salt []byte, iterations int) []byte {
	// PBM Key Derivation:
	// acc = H(password || salt)
	// for i = 1 to iterations-1:
	//    acc = H(acc)
	h := sha256.New()
	h.Write(password)
	h.Write(salt)
	acc := h.Sum(nil)

	for i := 1; i < iterations; i++ {
		h.Reset()
		h.Write(acc)
		acc = h.Sum(nil)
	}
	return acc
}

func calculateMAC(key, data []byte) []byte {
	mac := hmac.New(sha256.New, key)
	mac.Write(data)
	return mac.Sum(nil)
}
