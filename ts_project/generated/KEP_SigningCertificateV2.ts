
import { KEP_ESSCertIDv2 } from "./KEP_ESSCertIDv2";
import { CertificateExtensions_PolicyInformation } from "./CertificateExtensions_PolicyInformation";

export interface KEP_SigningCertificateV2 {
  certs: KEP_ESSCertIDv2[];
  policies?: CertificateExtensions_PolicyInformation[];
}
