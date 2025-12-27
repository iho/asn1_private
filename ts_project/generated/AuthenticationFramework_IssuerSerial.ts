
import { CertificateExtensions_GeneralNames } from "./CertificateExtensions_GeneralNames";
import { AuthenticationFramework_CertificateSerialNumber } from "./AuthenticationFramework_CertificateSerialNumber";
import { SelectedAttributeTypes_UniqueIdentifier } from "./SelectedAttributeTypes_UniqueIdentifier";

export interface AuthenticationFramework_IssuerSerial {
  issuer: CertificateExtensions_GeneralNames;
  serial: AuthenticationFramework_CertificateSerialNumber;
  issueruid?: SelectedAttributeTypes_UniqueIdentifier;
}
