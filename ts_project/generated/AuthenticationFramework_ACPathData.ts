
import { AuthenticationFramework_Certificate } from "./AuthenticationFramework_Certificate";
import { AuthenticationFramework_AttributeCertificate } from "./AuthenticationFramework_AttributeCertificate";

export interface AuthenticationFramework_ACPathData {
  certificate?: AuthenticationFramework_Certificate;
  attributecertificate?: AuthenticationFramework_AttributeCertificate;
}
