
import { KEP_GeneralNames } from "./KEP_GeneralNames";
import { AuthenticationFramework_CertificateSerialNumber } from "./AuthenticationFramework_CertificateSerialNumber";

export interface KEP_IssuerSerial {
  issuer: KEP_GeneralNames;
  serialnumber: AuthenticationFramework_CertificateSerialNumber;
}
