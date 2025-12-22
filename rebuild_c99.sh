#!/bin/bash
set -euo pipefail

ROOT_DIR="c99_output"

printf ': cleaning previous C99 output (%s)\n' "$ROOT_DIR"
# rm -rf "$ROOT_DIR"
# mkdir -p "$ROOT_DIR"

printf ': generating C99 headers for Basic suite -> %s\n' "$ROOT_DIR"
# ASN1_LANG=c99 ASN1_OUTPUT="$ROOT_DIR" elixir basic.ex

printf ': generating C99 headers for X-Series suite -> %s\n' "$ROOT_DIR"
# ASN1_LANG=c99 ASN1_OUTPUT="$ROOT_DIR" elixir x-series.ex

printf ': done. C99 headers available under %s\n' "$ROOT_DIR"

gcc -std=c99 -Wall -Wno-unused-function -I c99-asn1/include -I "${ROOT_DIR}" \
  -L c99-asn1/build -o test_roundtrip main.c -lasn1
DYLD_LIBRARY_PATH=c99-asn1/build ./test_roundtrip

printf '\n: compiling C99 CMP Client -> c99_client\n'
gcc -std=c99 -Wall -Wno-unused-function -I c99-asn1/include -I "${ROOT_DIR}" \
  -L c99-asn1/build -o c99_client c99_client.c -lasn1

printf '\n: running C99 CMP Client\n'
DYLD_LIBRARY_PATH=c99-asn1/build ./c99_client

