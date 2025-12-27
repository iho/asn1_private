
import { CertificateExtensions_CRLReason } from "./CertificateExtensions_CRLReason";

export interface KEP_RevokedInfo {
  revocationtime: Date;
  revocationreason?: CertificateExtensions_CRLReason;
}
