
import { AuthenticationFramework_AlgorithmIdentifier } from "./AuthenticationFramework_AlgorithmIdentifier";
import { KEP_OtherHashValue } from "./KEP_OtherHashValue";

export interface KEP_OtherHashAlgAndValue {
  hashalgorithm: AuthenticationFramework_AlgorithmIdentifier;
  hashval: KEP_OtherHashValue;
}
