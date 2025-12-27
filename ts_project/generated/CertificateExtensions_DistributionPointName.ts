
import { CertificateExtensions_GeneralNames } from "./CertificateExtensions_GeneralNames";
import { InformationFramework_RelativeDistinguishedName } from "./InformationFramework_RelativeDistinguishedName";

export interface CertificateExtensions_DistributionPointName {
  fullname?: CertificateExtensions_GeneralNames;
  namerelativetocrlissuer?: InformationFramework_RelativeDistinguishedName;
}
