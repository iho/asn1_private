
import { PKIX1Explicit_2009_Version } from "./PKIX1Explicit_2009_Version";
import { PKIX1Explicit_2009_CertificateSerialNumber } from "./PKIX1Explicit_2009_CertificateSerialNumber";
import { PKIX1Explicit_2009_Name } from "./PKIX1Explicit_2009_Name";
import { PKIX1Explicit_2009_Validity } from "./PKIX1Explicit_2009_Validity";
import { PKIX1Explicit_2009_SubjectPublicKeyInfo } from "./PKIX1Explicit_2009_SubjectPublicKeyInfo";
import { PKIX1Explicit_2009_UniqueIdentifier } from "./PKIX1Explicit_2009_UniqueIdentifier";

export interface PKIX1Explicit_2009_TBSCertificate {
  version?: PKIX1Explicit_2009_Version;
  serialnumber: PKIX1Explicit_2009_CertificateSerialNumber;
  signature: any;
  issuer: PKIX1Explicit_2009_Name;
  validity: PKIX1Explicit_2009_Validity;
  subject: PKIX1Explicit_2009_Name;
  subjectpublickeyinfo: PKIX1Explicit_2009_SubjectPublicKeyInfo;


  issueruniqueid?: PKIX1Explicit_2009_UniqueIdentifier;
  subjectuniqueid?: PKIX1Explicit_2009_UniqueIdentifier;


  extensions?: any;


}
