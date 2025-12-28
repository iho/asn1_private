package com.generated.asn1;

import com.hierynomus.asn1.ASN1InputStream;
import com.hierynomus.asn1.ASN1Serializer;
import com.hierynomus.asn1.types.*;
import com.hierynomus.asn1.types.constructed.*;
import com.hierynomus.asn1.types.primitive.*;
import com.hierynomus.asn1.types.string.*;
// import com.hierynomus.asn1.encoding.ASN1Tag; // Moved to types

import org.bouncycastle.asn1.pkcs.PKCSObjectIdentifiers;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x509.ExtensionsGenerator;
import org.bouncycastle.asn1.x509.SubjectPublicKeyInfo;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;
import org.bouncycastle.pkcs.PKCS10CertificationRequestBuilder;
import org.bouncycastle.pkcs.jcajce.JcaPKCS10CertificationRequestBuilder;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.*;
import java.security.spec.ECGenParameterSpec;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class Main {
    static {
        Security.addProvider(new BouncyCastleProvider());
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Java CMP Client ===");

        // 1. Generate Key Pair
        System.out.println("Generating P-384 KeyPair...");
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("EC", "BC");
        kpg.initialize(new ECGenParameterSpec("secp384r1"));
        KeyPair kp = kpg.generateKeyPair();

        // 2. Generate CSR (p10cr)
        System.out.println("Generating CSR...");
        X500Name subject = new X500Name("CN=robot_go");
        JcaPKCS10CertificationRequestBuilder csrBuilder = new JcaPKCS10CertificationRequestBuilder(subject,
                kp.getPublic());
        JcaContentSignerBuilder signerBuilder = new JcaContentSignerBuilder("SHA384withECDSA").setProvider("BC");
        ContentSigner signer = signerBuilder.build(kp.getPrivate());
        PKCS10CertificationRequest csr = csrBuilder.build(signer);
        byte[] csrDer = csr.getEncoded();

        // Decode CSR to ASN1Object for wrapping
        ASN1Object csrObject = parseASN1(csrDer);

        // 3. Construct PKIBody (p10cr [4])
        // PKIBody ::= CHOICE { ... p10cr [4] CertificationRequest ... }
        // CertificationRequest matched PKCS10 structure.
        // Wrap in [4] EXPLICIT
        // PKIBody is CHOICE, p10cr is [4] CertificationRequest
        // Don't use wrapper - use raw ASN1TaggedObject
        ASN1TaggedObject body = new ASN1TaggedObject(ASN1Tag.contextSpecific(4), csrObject, true);

        // 4. Construct Header
        // Sender: GeneralName = [2] dNSName IA5String (Implicit/Explicit based on
        // modules? Go used Context 2 primitive/implicit)
        // PKIX1Implicit_2009_GeneralName implies implicit tagging for its choice?
        // GeneralName ::= CHOICE { ... dNSName [2] IA5String ... }
        // In Implicit module, the choice options are implicit usually if tagged?
        // Wait, CHOICE options are always EXPLICIT unless module says otherwise?
        // Go definition: dNSName [2] IMPLICIT IA5String.
        // Let's create dNSName tagged object.
        ASN1Tag tagDNS = ASN1Tag.contextSpecific(2);
        // IA5String is Primitive.
        // Use ASN1PrimitiveValue for IA5String fallback. Tag 22? Or Use tagDNS
        // directly?
        // If IMPLICIT, we use tagDNS directly.
        // Use ASN1TaggedObject(Context(2), IA5String, IMPLICIT) directly to avoid
        // Wrapper Serialization issues.
        ASN1TaggedObject senderAPI = new ASN1TaggedObject(tagDNS, createIA5String("robot_go"), false);
        ASN1TaggedObject recipientAPI = new ASN1TaggedObject(tagDNS, createIA5String("localhost"), false);

        // PBM Parameters
        byte[] salt = new byte[16];
        new SecureRandom().nextBytes(salt);
        int iterationCount = 10000;
        // OWF: id-sha256: 2.16.840.1.101.3.4.2.1
        // MAC: id-hmacWithSHA256: 1.2.840.113549.2.9
        // PBM OID: 1.2.840.113533.7.66.13

        ASN1ObjectIdentifier pbmOid = new ASN1ObjectIdentifier("1.2.840.113533.7.66.13");
        ASN1ObjectIdentifier owfOid = new ASN1ObjectIdentifier("2.16.840.1.101.3.4.2.1");
        ASN1ObjectIdentifier macOid = new ASN1ObjectIdentifier("1.2.840.113549.2.9");

        // Construct PBMParameter SEQUENCE
        // PBMParameter ::= SEQUENCE { salt OCTET STRING, owf AlgorithmIdentifier,
        // iterationCount INTEGER, mac AlgorithmIdentifier }
        // AlgorithmIdentifier ::= SEQUENCE { algorithm OBJECT IDENTIFIER, parameters
        // ANY OPTIONAL }

        List<ASN1Object> owfSeqList = new ArrayList<>();
        owfSeqList.add(owfOid);
        ASN1Sequence owfAlg = new ASN1Sequence(owfSeqList);

        List<ASN1Object> macSeqList = new ArrayList<>();
        macSeqList.add(macOid);
        ASN1Sequence macAlg = new ASN1Sequence(macSeqList);

        List<ASN1Object> pbmParamSeqList = new ArrayList<>();
        pbmParamSeqList.add(new ASN1OctetString(salt));
        pbmParamSeqList.add(owfAlg);
        pbmParamSeqList.add(new ASN1Integer(BigInteger.valueOf(iterationCount)));
        pbmParamSeqList.add(macAlg);
        ASN1Sequence pbmParams = new ASN1Sequence(pbmParamSeqList);

        // ProtectionAlg: AlgorithmIdentifier
        // parameters = pbmParams (wrapped in whatever AlgorithmIdentifier expects,
        // usually ANY/Object)
        List<ASN1Object> protAlgList = new ArrayList<>();
        protAlgList.add(pbmOid);
        protAlgList.add(pbmParams);
        ASN1Sequence protectionAlg = new ASN1Sequence(protAlgList);

        // Debug: print serialized bytes
        byte[] protAlgBytes = serialize(protectionAlg);
        System.out.print("ProtectionAlg DER (" + protAlgBytes.length + " bytes): ");
        for (byte b : protAlgBytes)
            System.out.printf("%02X ", b);
        System.out.println();

        // header.protectionAlg expects PKIXCMP_2009_AlgorithmIdentifier (Wrapper over
        // ASN1Sequence).
        // Since I generated wrappers, I should use them logically, but underlying they
        // are ASN1Sequence usually.
        // Wait, AlgorithmIdentifier is SEQUENCE. So I create ASN1Sequence.
        // And I can wrap it: new PKIXCMP_2009_AlgorithmIdentifier(protectionAlg)?
        // I won't use wrapper classes everywhere to keep it simple, checking "Header"
        // constructor.
        // PKIHeader takes List (it extends ASN1Sequence).

        // TransactionID / Nonce
        byte[] tid = new byte[16];
        new SecureRandom().nextBytes(tid);
        byte[] nonce = new byte[16];
        new SecureRandom().nextBytes(nonce);

        List<ASN1Object> headerFields = new ArrayList<>();
        headerFields.add(new ASN1Integer(BigInteger.valueOf(2))); // pvno
        headerFields.add(senderAPI); // sender
        headerFields.add(recipientAPI); // recipient

        headerFields.add(new ASN1TaggedObject(ASN1Tag.contextSpecific(0), createGeneralizedTime(Instant.now()), true)); // messageTime
                                                                                                                        // [0]
        headerFields.add(new ASN1TaggedObject(ASN1Tag.contextSpecific(1), protectionAlg, true)); // protectionAlg [1]
        headerFields.add(new ASN1TaggedObject(ASN1Tag.contextSpecific(4), new ASN1OctetString(tid), true)); // transactionID
                                                                                                            // [4]
        headerFields.add(new ASN1TaggedObject(ASN1Tag.contextSpecific(5), new ASN1OctetString(nonce), true)); // senderNonce
                                                                                                              // [5]

        // Don't use wrapper - use raw ASN1Sequence
        ASN1Sequence header = new ASN1Sequence(headerFields);

        // 5. Calculate Protection
        List<ASN1Object> protectedPartList = new ArrayList<>();
        protectedPartList.add(header);
        protectedPartList.add(body);
        ASN1Sequence protectedPart = new ASN1Sequence(protectedPartList);

        byte[] protectedPartDer = serialize(protectedPart);
        System.out.print("ProtectedPart DER (" + protectedPartDer.length + " bytes first 32): ");
        for (int i = 0; i < Math.min(32, protectedPartDer.length); i++)
            System.out.printf("%02X ", protectedPartDer[i]);
        System.out.println("...");

        byte[] macKey = calculatePBMMac(salt, iterationCount, "0000".getBytes()); // Pwd "0000"
        System.out.print("MAC Key: ");
        for (byte b : macKey)
            System.out.printf("%02X ", b);
        System.out.println();

        byte[] macValue = hmac(macKey, protectedPartDer);
        System.out.print("MAC Value: ");
        for (byte b : macValue)
            System.out.printf("%02X ", b);
        System.out.println();

        // Create BitString directly from bytes with 0 unused bits
        // ASN1BitString(BitSet) reverses bits, so we create one and set bytes via
        // reflection
        // Actually, try using BitSet properly - it stores bits in little-endian order
        // For MAC, we need the exact bytes. Use a workaround:
        // Create an opaque BitString using custom serialization
        ASN1Object protection = createBitStringFromBytes(macValue);

        // 6. Construct Message
        List<ASN1Object> msgList = new ArrayList<>();
        msgList.add(header);
        msgList.add(body);
        msgList.add(new ASN1TaggedObject(ASN1Tag.contextSpecific(0), protection, true)); // protection [0] simple?
        // PKIMessage:
        // header
        // body
        // protection [0] PKIProtection OPTIONAL.
        // PKIProtection ::= BIT STRING.
        // Tag [0] EXPLICIT or IMPLICIT?
        // In PKIXCMP 2009, tags are explicit by default?
        // "protection [0] PKIProtection OPTIONAL" -> If PKIProtection is simple type,
        // usually Explicit in 2009?
        // I'll assume Explicit.

        PKIXCMP_2009_PKIMessage msg = new PKIXCMP_2009_PKIMessage(msgList);

        System.out.println("Sending Request...");
        byte[] msgDer = serialize(msg);

        // Debug: dump full message
        System.out.println("Full PKIMessage DER (" + msgDer.length + " bytes):");
        for (int i = 0; i < msgDer.length; i++) {
            System.out.printf("%02X ", msgDer[i]);
            if ((i + 1) % 32 == 0)
                System.out.println();
        }
        System.out.println();

        // 7. Send via raw TCP (like Go client - HttpClient has issues with CA)
        try (java.net.Socket socket = new java.net.Socket("localhost", 8829)) {
            String httpReq = "POST / HTTP/1.0\r\n" +
                    "Host: localhost:8829\r\n" +
                    "Content-Type: application/pkixcmp\r\n" +
                    "Content-Length: " + msgDer.length + "\r\n" +
                    "Connection: close\r\n" +
                    "\r\n";

            java.io.OutputStream out = socket.getOutputStream();
            out.write(httpReq.getBytes());
            out.write(msgDer);
            out.flush();
            socket.shutdownOutput(); // Signal EOF to server (like Go's CloseWrite)

            System.out.println("Request sent. Reading response...");

            // Use single BufferedInputStream for both headers and body
            java.io.BufferedInputStream bis = new java.io.BufferedInputStream(socket.getInputStream());

            // Read HTTP response manually
            ByteArrayOutputStream headerBuf = new ByteArrayOutputStream();
            int prev = 0, curr;
            boolean inBody = false;
            while ((curr = bis.read()) != -1) {
                if (prev == '\r' && curr == '\n') {
                    String headerLine = headerBuf.toString().trim();
                    headerBuf.reset();
                    if (headerLine.isEmpty()) {
                        inBody = true;
                        break; // Empty line = end of headers
                    }
                    if (headerLine.startsWith("HTTP")) {
                        System.out.println("Status: " + headerLine);
                    }
                } else if (curr != '\r' && curr != '\n') {
                    headerBuf.write(curr);
                }
                prev = curr;
            }

            // Read body
            ByteArrayOutputStream bodyBuf = new ByteArrayOutputStream();
            byte[] buf = new byte[4096];
            int n;
            while ((n = bis.read(buf)) != -1) {
                bodyBuf.write(buf, 0, n);
            }
            byte[] respBody = bodyBuf.toByteArray();
            System.out.println("Response body: " + respBody.length + " bytes");

            if (respBody.length > 0) {
                // Hex dump first 64 bytes
                System.out.print("Response DER: ");
                for (int i = 0; i < Math.min(64, respBody.length); i++) {
                    System.out.printf("%02X ", respBody[i]);
                }
                System.out.println("...");

                // Parse and print human-readable format
                printPKIMessageDetails(respBody);

                System.out.println("\n=== Java CMP Client SUCCESS ===");
            }
        }
    }

    // Print human-readable PKIMessage response
    private static void printPKIMessageDetails(byte[] respBody) {
        System.out.println("\n--- PKIMessage Response Details ---");
        try {
            // Parse as ASN.1 SEQUENCE
            java.io.ByteArrayInputStream bais = new java.io.ByteArrayInputStream(respBody);
            com.hierynomus.asn1.ASN1InputStream ais = new com.hierynomus.asn1.ASN1InputStream(
                    new com.hierynomus.asn1.encodingrules.ber.BERDecoder(), bais);
            ASN1Object msg = ais.readObject();

            if (msg instanceof ASN1Sequence) {
                ASN1Sequence seq = (ASN1Sequence) msg;
                System.out.println("PKIMessage SEQUENCE with " + seq.size() + " elements");

                // Header is first element
                if (seq.size() > 0) {
                    ASN1Object headerObj = seq.get(0);
                    System.out.println("  Header: " + headerObj.getClass().getSimpleName());
                }

                // Body is second element (context-tagged)
                if (seq.size() > 1) {
                    ASN1Object bodyObj = seq.get(1);
                    ASN1Tag bodyTag = bodyObj.getTag();
                    int bodyType = bodyTag.getTag();
                    String bodyTypeName = switch (bodyType) {
                        case 0 -> "ir (Initialization Request)";
                        case 1 -> "ip (Initialization Response)";
                        case 2 -> "cr (Certification Request)";
                        case 3 -> "cp (Certification Response)";
                        case 4 -> "p10cr (PKCS#10 Request)";
                        case 5 -> "popdecc (POP Challenge)";
                        case 6 -> "popdecr (POP Response)";
                        case 7 -> "kur (Key Update Request)";
                        case 8 -> "kup (Key Update Response)";
                        case 9 -> "krr (Key Recovery Request)";
                        case 10 -> "krp (Key Recovery Response)";
                        case 11 -> "rr (Revocation Request)";
                        case 12 -> "rp (Revocation Response)";
                        case 19 -> "pkiconf (Confirmation)";
                        case 23 -> "error (Error Message)";
                        default -> "unknown(" + bodyType + ")";
                    };
                    System.out.println("  Body Type: [" + bodyType + "] " + bodyTypeName);

                    // If it's a cp (3), try to extract certificate info
                    if (bodyType == 3 || bodyType == 1) {
                        System.out.println("  --> Certificate Response received!");
                    }
                }

                // Protection is third element [0]
                if (seq.size() > 2) {
                    ASN1Object protObj = seq.get(2);
                    System.out.println("  Protection: Present (MAC verified by CA)");
                }

                // ExtraCerts if present [1]
                if (seq.size() > 3) {
                    System.out.println("  ExtraCerts: Present");
                }
            }
        } catch (Exception e) {
            System.out.println("Could not parse response details: " + e.getMessage());
        }
        System.out.println("-----------------------------------");
    }

    private static ASN1Object createOpaqueSequence(byte[] fullDer) {
        // Parse tag and length manually to extract value
        if (fullDer[0] != 0x30)
            throw new IllegalArgumentException("Not a SEQUENCE");

        int offset = 1;
        int lenByte = fullDer[offset] & 0xFF;
        int lengthLen = 0;
        int valueLen = 0;

        if (lenByte > 127) {
            lengthLen = lenByte & 0x7F;
            offset++;
            for (int i = 0; i < lengthLen; i++) {
                valueLen = (valueLen << 8) | (fullDer[offset++] & 0xFF);
            }
        } else {
            valueLen = lenByte;
            offset++;
        }

        // Extract value bytes
        byte[] valueBytes = new byte[valueLen];
        System.arraycopy(fullDer, offset, valueBytes, 0, valueLen);

        final byte[] finalValue = valueBytes;

        // Create dummy object
        ASN1Object obj = new ASN1Object(new ASN1Tag(ASN1TagClass.UNIVERSAL, 16, ASN1Encoding.CONSTRUCTED) {
            @Override
            public com.hierynomus.asn1.ASN1Parser newParser(com.hierynomus.asn1.encodingrules.ASN1Decoder decoder) {
                return null;
            }

            @Override
            public ASN1Serializer newSerializer(com.hierynomus.asn1.encodingrules.ASN1Encoder encoder) {
                return new ASN1Serializer(encoder) {
                    public int serializedLength(ASN1Object asn1Object) throws IOException {
                        return finalValue.length;
                    }

                    public void serialize(ASN1Object asn1Object, com.hierynomus.asn1.ASN1OutputStream stream)
                            throws IOException {
                        // We need to write the VALUE bytes.
                        // BUT ASN1OutputStream calls stream.write(tag); stream.writeLength(len);
                        // serialize(val).
                        // So we just write bytes here!
                        stream.write(finalValue);
                    }
                };
            }
        }) {
            @Override
            public Object getValue() {
                return finalValue;
            }
        };
        return obj;
    }

    // Create ASN1 BIT STRING from raw bytes with 0 unused bits
    // asn-one's ASN1BitString has issues with unused bits, so we create an opaque
    // object
    private static ASN1Object createBitStringFromBytes(byte[] bytes) {
        final byte[] data = bytes;
        // BIT STRING content: 1 byte for unused bits count (0x00) + data bytes
        final byte[] content = new byte[1 + data.length];
        content[0] = 0x00; // 0 unused bits
        System.arraycopy(data, 0, content, 1, data.length);

        return new ASN1Object(new ASN1Tag(ASN1TagClass.UNIVERSAL, 3, ASN1Encoding.PRIMITIVE) {
            @Override
            public com.hierynomus.asn1.ASN1Parser newParser(com.hierynomus.asn1.encodingrules.ASN1Decoder decoder) {
                return null;
            }

            @Override
            public ASN1Serializer newSerializer(com.hierynomus.asn1.encodingrules.ASN1Encoder encoder) {
                return new ASN1Serializer(encoder) {
                    public int serializedLength(ASN1Object asn1Object) throws IOException {
                        return content.length;
                    }

                    public void serialize(ASN1Object asn1Object, com.hierynomus.asn1.ASN1OutputStream stream)
                            throws IOException {
                        stream.write(content);
                    }
                };
            }
        }) {
            @Override
            public Object getValue() {
                return data;
            }
        };
    }

    private static ASN1Object parseASN1(byte[] data) throws IOException {
        // Fallback for CSR
        return createOpaqueSequence(data);
    }

    private static byte[] serialize(ASN1Object obj) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (com.hierynomus.asn1.ASN1OutputStream out = new com.hierynomus.asn1.ASN1OutputStream(
                new com.hierynomus.asn1.encodingrules.der.DEREncoder(), baos)) {
            out.writeObject(obj);
        }
        return baos.toByteArray();
    }

    // Helper to create IA5String (Tag 22)
    private static ASN1Object createIA5String(String text) {
        try {
            ASN1OctetString val = new ASN1OctetString(text.getBytes());
            // Create custom tag 22 (IA5String)
            ASN1Tag tag22 = new ASN1Tag(ASN1TagClass.UNIVERSAL, 22, ASN1Encoding.PRIMITIVE) {
                @Override
                public com.hierynomus.asn1.ASN1Parser newParser(com.hierynomus.asn1.encodingrules.ASN1Decoder decoder) {
                    return new ASN1OctetString.Parser(decoder);
                }

                @Override
                public ASN1Serializer newSerializer(com.hierynomus.asn1.encodingrules.ASN1Encoder encoder) {
                    return new ASN1OctetString.Serializer(encoder);
                }
            };
            java.lang.reflect.Field field = ASN1Object.class.getDeclaredField("tag");
            field.setAccessible(true);
            field.set(val, tag22);
            return val;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private static ASN1Object createGeneralizedTime(Instant instant) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss'Z'").withZone(ZoneId.of("UTC"));
            String str = formatter.format(instant);
            ASN1OctetString val = new ASN1OctetString(str.getBytes());

            // Create custom tag 24
            ASN1Tag tag24 = new ASN1Tag(ASN1TagClass.UNIVERSAL, 24, ASN1Encoding.PRIMITIVE) {
                @Override
                public com.hierynomus.asn1.ASN1Parser newParser(com.hierynomus.asn1.encodingrules.ASN1Decoder decoder) {
                    return new ASN1OctetString.Parser(decoder);
                }

                @Override
                public ASN1Serializer newSerializer(com.hierynomus.asn1.encodingrules.ASN1Encoder encoder) {
                    return new ASN1OctetString.Serializer(encoder);
                }
            };

            // Reflection
            java.lang.reflect.Field field = ASN1Object.class.getDeclaredField("tag");
            field.setAccessible(true);
            field.set(val, tag24);

            return val;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private static byte[] calculatePBMMac(byte[] salt, int iterations, byte[] password) throws Exception {
        // Acc = H(password + salt)
        MessageDigest sha = MessageDigest.getInstance("SHA-256");
        sha.update(password);
        sha.update(salt);
        byte[] acc = sha.digest();

        for (int i = 1; i < iterations; i++) {
            acc = sha.digest(acc);
        }
        return acc;
    }

    private static byte[] hmac(byte[] key, byte[] data) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(key, "HmacSHA256"));
        return mac.doFinal(data);
    }
}
