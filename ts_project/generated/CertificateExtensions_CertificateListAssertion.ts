
import { InformationFramework_Name } from "./InformationFramework_Name";
import { CertificateExtensions_CRLNumber } from "./CertificateExtensions_CRLNumber";
import { CertificateExtensions_ReasonFlags } from "./CertificateExtensions_ReasonFlags";
import { AuthenticationFramework_Time } from "./AuthenticationFramework_Time";
import { CertificateExtensions_DistributionPointName } from "./CertificateExtensions_DistributionPointName";

export interface CertificateExtensions_CertificateListAssertion {
  issuer?: InformationFramework_Name;
  mincrlnumber?: CertificateExtensions_CRLNumber;
  maxcrlnumber?: CertificateExtensions_CRLNumber;
  reasonflags?: CertificateExtensions_ReasonFlags;
  dateandtime?: AuthenticationFramework_Time;
  distributionpoint?: CertificateExtensions_DistributionPointName;
}
