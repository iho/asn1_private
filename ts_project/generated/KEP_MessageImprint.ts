
import { AuthenticationFramework_AlgorithmIdentifier } from "./AuthenticationFramework_AlgorithmIdentifier";

export interface KEP_MessageImprint {
  hashalgorithm: AuthenticationFramework_AlgorithmIdentifier;
  hashedmessage: any;
}
