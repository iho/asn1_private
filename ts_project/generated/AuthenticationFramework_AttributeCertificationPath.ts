
import { AuthenticationFramework_AttributeCertificate } from "./AuthenticationFramework_AttributeCertificate";
import { AuthenticationFramework_ACPathData } from "./AuthenticationFramework_ACPathData";

export interface AuthenticationFramework_AttributeCertificationPath {
  attributecertificate: AuthenticationFramework_AttributeCertificate;
  acpath?: AuthenticationFramework_ACPathData[];
}
