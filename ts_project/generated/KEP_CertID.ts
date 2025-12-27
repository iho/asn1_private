
import { AuthenticationFramework_AlgorithmIdentifier } from "./AuthenticationFramework_AlgorithmIdentifier";
import { AuthenticationFramework_CertificateSerialNumber } from "./AuthenticationFramework_CertificateSerialNumber";

export interface KEP_CertID {
  hashalgorithm: AuthenticationFramework_AlgorithmIdentifier;
  issuernamehash: any;
  issuerkeyhash: any;
  serialnumber: AuthenticationFramework_CertificateSerialNumber;
}
