
import { AuthenticationFramework_AttributeCertificate_toBeSigned } from "./AuthenticationFramework_AttributeCertificate_toBeSigned";
import { AuthenticationFramework_AlgorithmIdentifier } from "./AuthenticationFramework_AlgorithmIdentifier";

export interface AuthenticationFramework_AttributeCertificate {
  tobesigned: AuthenticationFramework_AttributeCertificate_toBeSigned;
  algorithmidentifier: AuthenticationFramework_AlgorithmIdentifier;
  encrypted: any;
}
