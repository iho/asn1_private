
import { AuthenticationFramework_Certificate_toBeSigned } from "./AuthenticationFramework_Certificate_toBeSigned";
import { AuthenticationFramework_AlgorithmIdentifier } from "./AuthenticationFramework_AlgorithmIdentifier";

export interface AuthenticationFramework_Certificate {
  tobesigned: AuthenticationFramework_Certificate_toBeSigned;
  algorithmidentifier: AuthenticationFramework_AlgorithmIdentifier;
  encrypted: any;
}
