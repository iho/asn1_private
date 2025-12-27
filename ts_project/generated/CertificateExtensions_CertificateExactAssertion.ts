
import { AuthenticationFramework_CertificateSerialNumber } from "./AuthenticationFramework_CertificateSerialNumber";
import { InformationFramework_Name } from "./InformationFramework_Name";

export interface CertificateExtensions_CertificateExactAssertion {
  serialnumber: AuthenticationFramework_CertificateSerialNumber;
  issuer: InformationFramework_Name;
}
