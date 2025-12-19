#!/bin/bash
set -e

echo "Preparing plaintext..."
printf "very secret message!\n" > message.txt

KEY=$(openssl rand -hex 16)
IV=$(openssl rand -hex 16)
echo "KEY=$KEY"
echo "IV=$IV"

echo "Encrypting with OpenSSL (AES-128-CBC)..."
openssl enc -aes-128-cbc -nosalt \
  -K "$KEY" -iv "$IV" \
  -in message.txt -out encrypted_openssl.bin

echo "Decrypting with Swift (AES-128-CBC)..."
swift run -Xswiftc -suppress-warnings chat-x509 cms aes-decrypt \
  -in encrypted_openssl.bin \
  -key "$KEY" \
  -iv "$IV" \
  -out decrypted_swift_from_openssl.txt

echo "Encrypting with Swift (AES-128-CBC)..."
swift run -Xswiftc -suppress-warnings chat-x509 cms aes-encrypt \
  -in message.txt \
  -key "$KEY" \
  -iv "$IV" \
  -out encrypted_swift.bin

echo "Decrypting with OpenSSL (AES-128-CBC)..."
openssl enc -d -aes-128-cbc -nosalt \
  -K "$KEY" -iv "$IV" \
  -in encrypted_swift.bin -out decrypted_openssl_from_swift.txt

echo "Verifying decrypted outputs..."
diff decrypted_swift_from_openssl.txt message.txt
diff decrypted_openssl_from_swift.txt message.txt

echo "Verifying ciphertext compatibility..."
diff encrypted_openssl.bin encrypted_swift.bin

rm encrypted_openssl.bin encrypted_swift.bin decrypted_swift_from_openssl.txt decrypted_openssl_from_swift.txt message.txt

echo "Passed!"