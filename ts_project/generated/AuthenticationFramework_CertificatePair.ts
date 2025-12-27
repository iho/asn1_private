
import { AuthenticationFramework_Certificate } from "./AuthenticationFramework_Certificate";

export interface AuthenticationFramework_CertificatePair {
  issuedbythisca?: AuthenticationFramework_Certificate;
  issuedtothisca?: AuthenticationFramework_Certificate;
}
