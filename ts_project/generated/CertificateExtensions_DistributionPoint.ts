
import { CertificateExtensions_DistributionPointName } from "./CertificateExtensions_DistributionPointName";
import { CertificateExtensions_ReasonFlags } from "./CertificateExtensions_ReasonFlags";
import { CertificateExtensions_GeneralNames } from "./CertificateExtensions_GeneralNames";

export interface CertificateExtensions_DistributionPoint {
  distributionpoint?: CertificateExtensions_DistributionPointName;
  reasons?: CertificateExtensions_ReasonFlags;
  crlissuer?: CertificateExtensions_GeneralNames;
}
