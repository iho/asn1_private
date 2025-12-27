
import { InformationFramework_Name } from "./InformationFramework_Name";
import { AuthenticationFramework_Time } from "./AuthenticationFramework_Time";
import { CertificateExtensions_DistributionPointName } from "./CertificateExtensions_DistributionPointName";

export interface CertificateExtensions_CertificateListExactAssertion {
  issuer: InformationFramework_Name;
  thisupdate: AuthenticationFramework_Time;
  distributionpoint?: CertificateExtensions_DistributionPointName;
}
