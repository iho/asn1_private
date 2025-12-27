
import { CertificateExtensions_DistributionPointName } from "./CertificateExtensions_DistributionPointName";
import { CertificateExtensions_ReasonFlags } from "./CertificateExtensions_ReasonFlags";

export interface CertificateExtensions_IssuingDistPointSyntax {
  distributionpoint?: CertificateExtensions_DistributionPointName;
  onlycontainsusercerts?: boolean;
  onlycontainscacerts?: boolean;
  onlysomereasons?: CertificateExtensions_ReasonFlags;
  indirectcrl?: boolean;
}
