
import { PKIX1Explicit88_TBSCertList } from "./PKIX1Explicit88_TBSCertList";
import { PKIX1Explicit88_AlgorithmIdentifier } from "./PKIX1Explicit88_AlgorithmIdentifier";

export interface PKIX1Explicit88_CertificateList {
  tbscertlist: PKIX1Explicit88_TBSCertList;
  signaturealgorithm: PKIX1Explicit88_AlgorithmIdentifier;
  signature: any;
}
