
import { AuthenticationFramework_Version } from "./AuthenticationFramework_Version";
import { AuthenticationFramework_CertificateSerialNumber } from "./AuthenticationFramework_CertificateSerialNumber";
import { AuthenticationFramework_AlgorithmIdentifier } from "./AuthenticationFramework_AlgorithmIdentifier";
import { InformationFramework_Name } from "./InformationFramework_Name";
import { AuthenticationFramework_Validity } from "./AuthenticationFramework_Validity";
import { AuthenticationFramework_SubjectPublicKeyInfo } from "./AuthenticationFramework_SubjectPublicKeyInfo";
import { SelectedAttributeTypes_UniqueIdentifier } from "./SelectedAttributeTypes_UniqueIdentifier";
import { AuthenticationFramework_Extensions } from "./AuthenticationFramework_Extensions";

export interface AuthenticationFramework_Certificate_toBeSigned {
  version?: AuthenticationFramework_Version;
  serialnumber: AuthenticationFramework_CertificateSerialNumber;
  signature: AuthenticationFramework_AlgorithmIdentifier;
  issuer: InformationFramework_Name;
  validity: AuthenticationFramework_Validity;
  subject: InformationFramework_Name;
  subjectpublickeyinfo: AuthenticationFramework_SubjectPublicKeyInfo;
  issueruniqueidentifier?: SelectedAttributeTypes_UniqueIdentifier;
  subjectuniqueidentifier?: SelectedAttributeTypes_UniqueIdentifier;
  extensions?: AuthenticationFramework_Extensions;
}
