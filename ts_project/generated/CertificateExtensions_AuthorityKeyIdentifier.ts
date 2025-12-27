
import { CertificateExtensions_KeyIdentifier } from "./CertificateExtensions_KeyIdentifier";
import { CertificateExtensions_GeneralNames } from "./CertificateExtensions_GeneralNames";
import { AuthenticationFramework_CertificateSerialNumber } from "./AuthenticationFramework_CertificateSerialNumber";

export interface CertificateExtensions_AuthorityKeyIdentifier {
  keyidentifier?: CertificateExtensions_KeyIdentifier;
  authoritycertissuer?: CertificateExtensions_GeneralNames;
  authoritycertserialnumber?: AuthenticationFramework_CertificateSerialNumber;
}
