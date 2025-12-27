
import { AuthenticationFramework_CertificateList_toBeSigned } from "./AuthenticationFramework_CertificateList_toBeSigned";
import { AuthenticationFramework_AlgorithmIdentifier } from "./AuthenticationFramework_AlgorithmIdentifier";

export interface AuthenticationFramework_CertificateList {
  tobesigned: AuthenticationFramework_CertificateList_toBeSigned;
  algorithmidentifier: AuthenticationFramework_AlgorithmIdentifier;
  encrypted: any;
}
