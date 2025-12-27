
import { KEP_TBSCertList } from "./KEP_TBSCertList";
import { AuthenticationFramework_AlgorithmIdentifier } from "./AuthenticationFramework_AlgorithmIdentifier";

export interface KEP_CertificateList {
  tbscertlist: KEP_TBSCertList;
  signaturealgorithm: AuthenticationFramework_AlgorithmIdentifier;
  signature: any;
}
