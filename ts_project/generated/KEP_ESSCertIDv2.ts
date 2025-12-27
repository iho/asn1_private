
import { AuthenticationFramework_AlgorithmIdentifier } from "./AuthenticationFramework_AlgorithmIdentifier";
import { KEP_Hash } from "./KEP_Hash";
import { KEP_IssuerSerial } from "./KEP_IssuerSerial";

export interface KEP_ESSCertIDv2 {
  hashalgorithm: AuthenticationFramework_AlgorithmIdentifier;
  certhash: KEP_Hash;
  issuerserial: KEP_IssuerSerial;
}
