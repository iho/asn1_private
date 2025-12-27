import { PKCS_10_CertificationRequest } from "./generated/PKCS_10_CertificationRequest";
import { PKCS_10_CertificationRequestInfo } from "./generated/PKCS_10_CertificationRequestInfo";
import { PKCS_10_SubjectPublicKeyInfo } from "./generated/PKCS_10_SubjectPublicKeyInfo";
import { PKCS_10_AlgorithmIdentifier } from "./generated/PKCS_10_AlgorithmIdentifier";
import { PKCS_10_Name } from "./generated/PKCS_10_Name";
import { PKIX1Explicit88_RDNSequence } from "./generated/PKIX1Explicit88_RDNSequence";
import { PKIX1Explicit88_RelativeDistinguishedName } from "./generated/PKIX1Explicit88_RelativeDistinguishedName";
import { PKIX1Explicit88_AttributeTypeAndValue } from "./generated/PKIX1Explicit88_AttributeTypeAndValue";
import { PKIX1Explicit88_AttributeValue } from "./generated/PKIX1Explicit88_AttributeValue";
import { createHash, createHmac, randomBytes } from "node:crypto";

// --- Manual DER Encoder (Minimal) ---

namespace DER {
    export function concat(...arrays: Uint8Array[]): Uint8Array {
        let total = 0;
        for (const arr of arrays) total += arr.length;
        const result = new Uint8Array(total);
        let offset = 0;
        for (const arr of arrays) {
            result.set(arr, offset);
            offset += arr.length;
        }
        return result;
    }

    export function encodeLength(len: number): Uint8Array {
        if (len < 128) {
            return new Uint8Array([len]);
        }
        const bytes = [];
        while (len > 0) {
            bytes.unshift(len & 0xff);
            len = len >> 8;
        }
        return new Uint8Array([0x80 | bytes.length, ...bytes]);
    }

    export function encodeTag(tagClass: number, constructed: boolean, tagNumber: number): Uint8Array {
        // Simple case: tagNumber < 31
        let byte = (tagClass << 6) | (constructed ? 0x20 : 0x00) | tagNumber;
        return new Uint8Array([byte]);
    }

    export function encodeSequence(content: Uint8Array): Uint8Array {
        return concat(encodeTag(0, true, 16), encodeLength(content.length), content);
    }

    export function encodeSet(content: Uint8Array): Uint8Array {
        return concat(encodeTag(0, true, 17), encodeLength(content.length), content);
    }

    export function encodeContextSpecific(tag: number, content: Uint8Array, constructed: boolean = true): Uint8Array {
        // Class 2 (Context Specific) = 10xxxxxx
        // Constructed bit = 00100000 (0x20)
        let tagByte = 0x80 | tag;
        if (constructed) {
            tagByte |= 0x20;
        }
        return concat(new Uint8Array([tagByte]), encodeLength(content.length), content);
    }

    export function encodeOctetString(data: Uint8Array): Uint8Array {
        return concat(encodeTag(0, false, 4), encodeLength(data.length), data);
    }

    export function encodeInteger(num: number): Uint8Array {
        // Only handling small positive integers for this demo
        let bytes: number[] = [];
        let val = num;

        if (val === 0) return concat(encodeTag(0, false, 2), encodeLength(1), new Uint8Array([0]));

        while (val > 0) {
            bytes.unshift(val & 0xff);
            val = val >> 8;
        }
        // Handle sign bit if MSB is set
        if (bytes[0] & 0x80) {
            bytes.unshift(0x00);
        }

        const content = new Uint8Array(bytes);
        return concat(encodeTag(0, false, 2), encodeLength(content.length), content);
    }

    export function encodeOID(oid: string): Uint8Array {
        const parts = oid.split('.').map(Number);
        const first = parts.shift()!;
        const second = parts.shift()!;

        const bytes: number[] = [];
        // First byte = first * 40 + second
        let v = first * 40 + second;

        // Helper to encode variable length quantity (VLQ)
        function encodeVLQ(val: number) {
            const arr = [];
            arr.unshift(val & 0x7f);
            val = val >> 7;
            while (val > 0) {
                arr.unshift((val & 0x7f) | 0x80);
                val = val >> 7;
            }
            return arr;
        }

        bytes.push(...encodeVLQ(v));

        for (const p of parts) {
            bytes.push(...encodeVLQ(p));
        }

        const content = new Uint8Array(bytes);
        return concat(encodeTag(0, false, 6), encodeLength(content.length), content);
    }

    export function encodeNull(): Uint8Array {
        return new Uint8Array([0x05, 0x00]);
    }

    export function encodeUTF8String(str: string): Uint8Array {
        const encoder = new TextEncoder();
        const content = encoder.encode(str);
        return concat(encodeTag(0, false, 12), encodeLength(content.length), content);
    }

    export function encodePrintableString(str: string): Uint8Array {
        const encoder = new TextEncoder();
        const content = encoder.encode(str);
        // PrintableString tag = 19 (0x13)
        return concat(encodeTag(0, false, 19), encodeLength(content.length), content);
    }

    export function encodeBitString(data: Uint8Array, unusedBits: number = 0): Uint8Array {
        const content = concat(new Uint8Array([unusedBits]), data);
        return concat(encodeTag(0, false, 3), encodeLength(content.length), content);
    }
}

// --- Manual DER Decoder (Minimal) ---

namespace DERDecoder {
    export class Reader {
        offset: number = 0;
        data: Uint8Array;

        constructor(data: Uint8Array) {
            this.data = data;
        }

        readTag(): { tagClass: number, constructed: boolean, tagNumber: number } {
            const byte = this.data[this.offset++];
            const tagClass = (byte >> 6) & 0x03;
            const constructed = (byte & 0x20) !== 0;
            let tagNumber = byte & 0x1f;

            if (tagNumber === 0x1f) {
                // High tag parsing not implemented for minimal example, assuming low tags
                throw new Error("High tag number parsing not implemented");
            }
            return { tagClass, constructed, tagNumber };
        }

        readLength(): number {
            let byte = this.data[this.offset++];
            if ((byte & 0x80) === 0) {
                return byte;
            }
            const numBytes = byte & 0x7f;
            let len = 0;
            for (let i = 0; i < numBytes; i++) {
                byte = this.data[this.offset++];
                len = (len << 8) | byte;
            }
            return len;
        }

        readTLV(): { tag: { tagClass: number, constructed: boolean, tagNumber: number }, length: number, value: Uint8Array, valueOffset: number } {
            const start = this.offset;
            const tag = this.readTag();
            const length = this.readLength();
            const valueOffset = this.offset;
            const value = this.data.slice(this.offset, this.offset + length);
            this.offset += length;
            return { tag, length, value, valueOffset };
        }

        peekTag(): number {
            return this.data[this.offset];
        }

        isAtEnd(): boolean {
            return this.offset >= this.data.length;
        }
    }

    export function parsePKIMessage(data: Uint8Array) {
        const reader = new Reader(data);
        console.log("\n--- Parsing Response ---");

        // PKIMessage SEQUENCE
        const msg = reader.readTLV();
        if (msg.tag.tagNumber !== 16) throw new Error("Expected SEQUENCE (PKIMessage)");
        console.log(`PKIMessage Sequence (${msg.length} bytes)`);

        const inner = new Reader(msg.value);

        // 1. PKIHeader (SEQUENCE)
        const header = inner.readTLV();
        if (header.tag.tagNumber !== 16) throw new Error("Expected SEQUENCE (PKIHeader)");
        console.log(`  PKIHeader (${header.length} bytes)`);

        // Parse Header content briefly? (PVNO, Sender, Recipient...)
        const headerReader = new Reader(header.value);
        const pvno = headerReader.readTLV(); // INTEGER
        console.log(`    pvno: ${pvno.value[0]}`); // 2

        const sender = headerReader.readTLV(); // GeneralName
        console.log(`    sender: GeneralName len=${sender.length}`);

        const recipient = headerReader.readTLV(); // GeneralName
        console.log(`    recipient: GeneralName len=${recipient.length}`);

        // 2. PKIBody (CHOICE)
        // [0] ip, [1] cp, [2] kup ... [23] error
        const bodyTLV = inner.readTLV();
        console.log(`  PKIBody Tag=[${bodyTLV.tag.tagNumber}] Class=${bodyTLV.tag.tagClass} Len=${bodyTLV.length}`);

        let bodyType = "Unknown";
        switch (bodyTLV.tag.tagNumber) {
            case 0: bodyType = "ir"; break;
            case 1: bodyType = "ip"; break;
            case 2: bodyType = "cr"; break;
            case 3: bodyType = "cp"; break;
            case 23: bodyType = "error"; break;
            // ...
        }
        console.log(`    Type: ${bodyType}`);

        // If Error, parse ErrorMsgContent
        if (bodyTLV.tag.tagNumber === 23) {
            // ErrorMsgContent ::= SEQUENCE { pKIStatusInfo, errorCode, errorDetails }
            const errReader = new Reader(bodyTLV.value);
            const statusInfo = errReader.readTLV(); // PKIStatusInfo SEQUENCE
            console.log(`    PKIStatusInfo len=${statusInfo.length}`);

            const statusReader = new Reader(statusInfo.value);
            const status = statusReader.readTLV(); // INTEGER 
            console.log(`      Status: ${status.value[0]}`); // 0=granted, 1=grantedWithMods, 2=rejection...

            const statusString = statusReader.isAtEnd() ? null : statusReader.readTLV();
            if (statusString) console.log(`      StatusString len=${statusString.length}`);

            const failInfo = statusReader.isAtEnd() ? null : statusReader.readTLV();
            if (failInfo) console.log(`      FailInfo bits: ${failInfo.value[0].toString(2)}`);
        }

    }
}

// --- PBM Crypto Helpers (Web Crypto API) ---

async function deriveKey(password: Uint8Array, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
    // Custom KDF: acc = H(password || salt) -> acc = H(acc) ...
    const msg = new Uint8Array(password.length + salt.length);
    msg.set(password);
    msg.set(salt, password.length);

    let acc = new Uint8Array(await crypto.subtle.digest("SHA-256", msg));

    for (let i = 1; i < iterations; i++) {
        acc = new Uint8Array(await crypto.subtle.digest("SHA-256", acc));
    }
    return acc;
}

async function calculateMAC(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
    const cryptoKey = await crypto.subtle.importKey(
        "raw", key,
        { name: "HMAC", hash: "SHA-256" },
        false, ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, data);
    return new Uint8Array(signature);
}

function getRandomBytes(len: number): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(len));
}


// --- Construction & Encoding Logic ---

async function main() {
    console.log("Constructing CA Request...");

    // 1. Generate Key Pair (ECC P-384)
    console.log("Generating Real ECDSA Key Pair (P-384)...");
    const keyPair = await crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: "P-384"
        },
        true, // extractable
        ["sign", "verify"]
    );
    const publicKey = keyPair.publicKey;
    const privateKey = keyPair.privateKey;

    // Export SPKI (SubjectPublicKeyInfo) - already DER encoded
    const spkiBuffer = await crypto.subtle.exportKey("spki", publicKey);
    const spkiDer = new Uint8Array(spkiBuffer);

    console.log("SPKI generated:", spkiDer.length, "bytes");

    // 2. Encode Contents (Inner to Outer)

    // Encode Name (Subject)
    const cnOid = DER.encodeOID("2.5.4.3");
    const cnValue = DER.encodePrintableString("robot_go");
    const cnSeq = DER.encodeSequence(DER.concat(cnOid, cnValue));
    const cnSet = DER.encodeSet(cnSeq);
    const subjectDer = DER.encodeSequence(cnSet);

    // Encode Attributes
    const attributesDer = new Uint8Array([0xA0, 0x00]);

    // Encode CertificationRequestInfo
    const versionDer = DER.encodeInteger(0);
    const infoContent = DER.concat(versionDer, subjectDer, spkiDer, attributesDer);
    const infoDer = DER.encodeSequence(infoContent);

    // 3. Signature Algorithm
    // ecdsa-with-SHA384: 1.2.840.10045.4.3.3
    const sigAlgOid = DER.encodeOID("1.2.840.10045.4.3.3");
    const sigAlgDer = DER.encodeSequence(sigAlgOid);

    // 4. Sign
    console.log("Signing CSR...");
    const rawSig = await crypto.subtle.sign(
        {
            name: "ECDSA",
            hash: { name: "SHA-384" },
        },
        privateKey,
        infoDer
    );

    // WebCrypto returns raw r|s for ECDSA (P-384 = 48 bytes r + 48 bytes s = 96 bytes)
    const rawSigBuf = new Uint8Array(rawSig);
    const r = rawSigBuf.slice(0, 48);
    const s = rawSigBuf.slice(48, 96);

    function encodeBigIntBuffer(buf: Uint8Array): Uint8Array {
        // Remove leading zeros if present (but check msb of remainder)
        // Actually, just handle MSB strictly.
        // If MSB (buf[0] & 0x80) is set, prepend 0x00.
        // Note: r and s are unsigned integers.
        // We should skip leading zeros from the buffer if we want minimal encoding, 
        // but adding 0x00 if needed is sufficient for validity.
        // However, if the buffer starts with 0x00 and the next byte is < 0x80, the 0x00 is redundant?
        // Let's just do the simple MSB check.
        // But also, if the number is small, we shouldn't output 48 bytes.
        // But P-384 signatures are usually full length.
        // Let's just prepend 00 if needed.
        if (buf[0] & 0x80) {
            return DER.concat(DER.encodeTag(0, false, 2), DER.encodeLength(buf.length + 1), new Uint8Array([0]), buf);
        }
        return DER.concat(DER.encodeTag(0, false, 2), DER.encodeLength(buf.length), buf);
    }

    const rDer = encodeBigIntBuffer(r);
    const sDer = encodeBigIntBuffer(s);
    const sigContent = DER.encodeSequence(DER.concat(rDer, sDer));
    const sigDer = DER.encodeBitString(sigContent);

    // 5. Final CertificationRequest
    const csrContent = DER.concat(infoDer, sigAlgDer, sigDer);
    const csrDer = DER.encodeSequence(csrContent);

    console.log(`CSR Encoded. Length: ${csrDer.length} bytes`);

    // --- WRAP IN PKIMESSAGE (CMP) ---
    console.log("Wrapping in PKIMessage with PBM Protection...");

    // 1. Header
    // GeneralName: dNSName [2] IMPLICIT IA5String
    function encodeDNSName(name: string): Uint8Array {
        const encoder = new TextEncoder();
        const content = encoder.encode(name);
        return DER.concat(new Uint8Array([0x82]), DER.encodeLength(content.length), content);
    }

    const sender = encodeDNSName("robot_go");
    const recipient = encodeDNSName("localhost");
    const pvno = DER.encodeInteger(2);

    // TransactionID and Nonce
    const rawTransID = getRandomBytes(16);
    const rawSenderNonce = getRandomBytes(16);

    // PBM Protection Setup
    const pbmOID = DER.encodeOID("1.2.840.113533.7.66.13");
    const salt = getRandomBytes(16);
    const iterationCount = 10000;

    // AlgorithmIdentifiers for OWF and MAC
    // OWF: sha256 (2.16.840.1.101.3.4.2.1)
    const owfAlgSimple = DER.encodeSequence(DER.encodeOID("2.16.840.1.101.3.4.2.1"));

    // MAC: hmacWithSHA256 (1.2.840.113549.2.9)
    const macAlgSimple = DER.encodeSequence(DER.encodeOID("1.2.840.113549.2.9"));

    // PBMParameter ::= SEQUENCE { salt OCTET STRING, owf AlgorithmIdentifier, iterationCount INTEGER, mac AlgorithmIdentifier }
    const pbmParams = DER.encodeSequence(DER.concat(
        DER.encodeOctetString(salt),
        owfAlgSimple,
        DER.encodeInteger(iterationCount),
        macAlgSimple
    ));

    // ProtectionAlg = AlgorithmIdentifier { algorithm pbmOID, parameters pbmParams }
    const protectionAlg = DER.encodeSequence(DER.concat(pbmOID, pbmParams));

    // Header Fields:
    // pvno, sender, recipient, messageTime [0]?, protectionAlg [1]?, senderKID [2], recipKID [3], transID [4], senderNonce [5], ...
    // Note: protectionAlg is [1] EXPLICIT AlgorithmIdentifier OPTIONAL
    const protectionAlgTagged = DER.encodeContextSpecific(1, protectionAlg, true);

    // transID is [4] OCTET STRING OPTIONAL.
    // Server error suggests it expects EXPLICIT tagging (trying to decode the content).
    // So we assume [4] EXPLICIT OCTET STRING.
    // DER.encodeContextSpecific(4, transID, true) -> A4 Length (04 Length Value)
    const transIDTagged = DER.encodeContextSpecific(4, DER.encodeOctetString(rawTransID), true);
    const senderNonceTagged = DER.encodeContextSpecific(5, DER.encodeOctetString(rawSenderNonce), true);

    const headerContent = DER.concat(pvno, sender, recipient, protectionAlgTagged, transIDTagged, senderNonceTagged);
    const headerDer = DER.encodeSequence(headerContent);

    // 2. Body
    const bodyDer = DER.encodeContextSpecific(4, csrDer, true);

    // 3. Calculate Protection
    // Input: DER(ProtectedPart)
    // ProtectedPart ::= SEQUENCE { header PKIHeader, body PKIBody }
    const protectedPartContent = DER.concat(headerDer, bodyDer);
    const protectedPart = DER.encodeSequence(protectedPartContent);

    // Key Derivation
    const password = new TextEncoder().encode("0000"); // Use U8Array
    const key = await deriveKey(password, salt, iterationCount);
    const mac = await calculateMAC(key, protectedPart);

    const protectionDer = DER.encodeBitString(mac);

    // Protection is [0] BIT STRING OPTIONAL
    // Server expects [0] tag.
    // Likely [0] EXPLICIT PKIProtection
    const protectionTagged = DER.encodeContextSpecific(0, protectionDer, true);

    // 4. PKIMessage
    // Msg = SEQUENCE { header, body, protection }
    const msgContent = DER.concat(headerDer, bodyDer, protectionTagged);
    const msgDer = DER.encodeSequence(msgContent);

    console.log(`PKIMessage Encoded. Length: ${msgDer.length} bytes`);
    console.log(`  Header: ${headerDer.length}`);
    console.log(`  Body: ${bodyDer.length}`);
    console.log(`  Protection (Tagged): ${protectionTagged.length}`);
    console.log("Full Msg Hex:", Buffer.from(msgDer).toString('hex'));


    // --- SEND TO CA ---
    console.log("\nSending PKIMessage to CA at http://localhost:8829/...");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 500);

    try {
        const response = await fetch("http://localhost:8829/", {
            method: "POST",
            headers: {
                "Content-Type": "application/pkixcmp",
                "Connection": "close"
            },
            body: msgDer,
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        console.log(`Response Status: ${response.status} ${response.statusText}`);

        // Log Headers
        response.headers.forEach((val, key) => {
            console.log(`Header [${key}]: ${val}`);
        });

        // Read Response Body Stream
        console.log("Reading response body stream...");
        const reader = response.body?.getReader();
        const chunks: Uint8Array[] = [];
        let totalLength = 0;

        if (reader) {
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    console.log("Stream complete.");
                    break;
                }
                if (value) {
                    console.log(`Received chunk: ${value.length} bytes`);
                    chunks.push(value);
                    totalLength += value.length;

                    // Attempt Parsing on accumulated data
                    const currentData = new Uint8Array(totalLength);
                    let off = 0;
                    for (const c of chunks) {
                        currentData.set(c, off);
                        off += c.length;
                    }

                    try {
                        console.log(`Attempting to parse ${currentData.length} bytes...`);
                        DERDecoder.parsePKIMessage(currentData);
                        console.log("Parsing successful! Closing connection.");
                        reader.cancel(); // Stop reading
                        break;
                    } catch (e) {
                        // Verify if error is just "incomplete data" vs structure error?
                        // For now, if it fails, we wait for more.
                        // But if we have a full message, parsePKIMessage should return cleanly.
                        // Note: DERDecoder.parsePKIMessage doesn't return anything, just logs.
                        // We assume if it runs without throw, it's good.
                        // WARNING: parsePKIMessage might not throw on trailing data or might throw on incomplete.
                    }
                }
            }
        }

        const responseArray = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
            responseArray.set(chunk, offset);
            offset += chunk.length;
        }

        console.log(`Total Received: ${responseArray.length} bytes.`);

        if (responseArray.length > 0) {
            // console.log("Response Body Hex:", Buffer.from(responseArray).toString('hex'));
            try {
                DERDecoder.parsePKIMessage(responseArray);
            } catch (err) {
                console.error("Failed to parse response:", err);
                console.log("Raw Hex:", Buffer.from(responseArray).toString('hex'));
            }
        }
    } catch (err) {
        console.error("Request failed:", err);
    }
}

main().catch(console.error);
