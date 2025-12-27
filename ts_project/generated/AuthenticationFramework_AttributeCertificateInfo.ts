
import { AuthenticationFramework_Version } from "./AuthenticationFramework_Version";
import { CertificateExtensions_GeneralNames } from "./CertificateExtensions_GeneralNames";
import { AuthenticationFramework_AlgorithmIdentifier } from "./AuthenticationFramework_AlgorithmIdentifier";
import { AuthenticationFramework_CertificateSerialNumber } from "./AuthenticationFramework_CertificateSerialNumber";
import { AuthenticationFramework_AttCertValidityPeriod } from "./AuthenticationFramework_AttCertValidityPeriod";
import { InformationFramework_Attribute } from "./InformationFramework_Attribute";
import { SelectedAttributeTypes_UniqueIdentifier } from "./SelectedAttributeTypes_UniqueIdentifier";
import { AuthenticationFramework_Extensions } from "./AuthenticationFramework_Extensions";

export interface AuthenticationFramework_AttributeCertificateInfo {
  version?: AuthenticationFramework_Version;
  subject: any;
  issuer: CertificateExtensions_GeneralNames;
  signature: AuthenticationFramework_AlgorithmIdentifier;
  serialnumber: AuthenticationFramework_CertificateSerialNumber;
  attcertvalidityperiod: AuthenticationFramework_AttCertValidityPeriod;
  attributes: InformationFramework_Attribute[];
  issueruniqueid?: SelectedAttributeTypes_UniqueIdentifier;
  extensions?: AuthenticationFramework_Extensions;
}
