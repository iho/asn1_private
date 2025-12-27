
import { AuthenticationFramework_Certificate } from "./AuthenticationFramework_Certificate";
import { AuthenticationFramework_CertificatePair } from "./AuthenticationFramework_CertificatePair";

export interface AuthenticationFramework_CertificationPath {
  usercertificate: AuthenticationFramework_Certificate;
  thecacertificates?: AuthenticationFramework_CertificatePair[];
}
