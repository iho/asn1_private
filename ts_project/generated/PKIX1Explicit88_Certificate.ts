
import { PKIX1Explicit88_TBSCertificate } from "./PKIX1Explicit88_TBSCertificate";
import { PKIX1Explicit88_AlgorithmIdentifier } from "./PKIX1Explicit88_AlgorithmIdentifier";

export interface PKIX1Explicit88_Certificate {
  tbscertificate: PKIX1Explicit88_TBSCertificate;
  signaturealgorithm: PKIX1Explicit88_AlgorithmIdentifier;
  signature: any;
}
