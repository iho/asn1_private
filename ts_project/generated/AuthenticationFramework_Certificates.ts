
import { AuthenticationFramework_Certificate } from "./AuthenticationFramework_Certificate";
import { AuthenticationFramework_ForwardCertificationPath } from "./AuthenticationFramework_ForwardCertificationPath";

export interface AuthenticationFramework_Certificates {
  usercertificate: AuthenticationFramework_Certificate;
  certificationpath?: AuthenticationFramework_ForwardCertificationPath;
}
