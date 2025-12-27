
import { KEP_CMSVersion } from "./KEP_CMSVersion";
import { KEP_SignerIdentifier } from "./KEP_SignerIdentifier";
import { KEP_DigestAlgorithmIdentifier } from "./KEP_DigestAlgorithmIdentifier";
import { KEP_SignedAttributes } from "./KEP_SignedAttributes";
import { KEP_SignatureAlgorithmIdentifier } from "./KEP_SignatureAlgorithmIdentifier";
import { KEP_UnsignedAttributes } from "./KEP_UnsignedAttributes";

export interface KEP_SignerInfo {
  version: KEP_CMSVersion;
  sid: KEP_SignerIdentifier;
  digestalgorithm: KEP_DigestAlgorithmIdentifier;
  signedattrs?: KEP_SignedAttributes;
  signaturealgorithm: KEP_SignatureAlgorithmIdentifier;
  signature: any;
  unsignedattrs?: KEP_UnsignedAttributes;
}
