
import { PKIX1Explicit_2009_CertificateList_toBeSigned } from "./PKIX1Explicit_2009_CertificateList_toBeSigned";
import { PKIX1Explicit_2009_AlgorithmIdentifier } from "./PKIX1Explicit_2009_AlgorithmIdentifier";

export interface PKIX1Explicit_2009_CertificateList {
  tobesigned: PKIX1Explicit_2009_CertificateList_toBeSigned;
  algorithmidentifier: PKIX1Explicit_2009_AlgorithmIdentifier;
  encrypted: any;
}
