
import { AuthenticationFramework_CertificateSerialNumber } from "./AuthenticationFramework_CertificateSerialNumber";
import { InformationFramework_Name } from "./InformationFramework_Name";
import { CertificateExtensions_SubjectKeyIdentifier } from "./CertificateExtensions_SubjectKeyIdentifier";
import { CertificateExtensions_AuthorityKeyIdentifier } from "./CertificateExtensions_AuthorityKeyIdentifier";
import { AuthenticationFramework_Time } from "./AuthenticationFramework_Time";
import { CertificateExtensions_KeyUsage } from "./CertificateExtensions_KeyUsage";
import { CertificateExtensions_AltNameType } from "./CertificateExtensions_AltNameType";
import { CertificateExtensions_CertPolicySet } from "./CertificateExtensions_CertPolicySet";

export interface CertificateExtensions_CertificateAssertion {
  serialnumber?: AuthenticationFramework_CertificateSerialNumber;
  issuer?: InformationFramework_Name;
  subjectkeyidentifier?: CertificateExtensions_SubjectKeyIdentifier;
  authoritykeyidentifier?: CertificateExtensions_AuthorityKeyIdentifier;
  certificatevalid?: AuthenticationFramework_Time;
  privatekeyvalid?: Date;
  subjectpublickeyalgid?: any;
  keyusage?: CertificateExtensions_KeyUsage;
  subjectaltname?: CertificateExtensions_AltNameType;
  policy?: CertificateExtensions_CertPolicySet;
  pathtoname?: InformationFramework_Name;
}
