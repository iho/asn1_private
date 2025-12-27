
import { PKIX1Explicit88_Version } from "./PKIX1Explicit88_Version";
import { PKIX1Explicit88_CertificateSerialNumber } from "./PKIX1Explicit88_CertificateSerialNumber";
import { PKIX1Explicit88_AlgorithmIdentifier } from "./PKIX1Explicit88_AlgorithmIdentifier";
import { PKIX1Explicit88_Name } from "./PKIX1Explicit88_Name";
import { PKIX1Explicit88_Validity } from "./PKIX1Explicit88_Validity";
import { PKIX1Explicit88_SubjectPublicKeyInfo } from "./PKIX1Explicit88_SubjectPublicKeyInfo";
import { PKIX1Explicit88_UniqueIdentifier } from "./PKIX1Explicit88_UniqueIdentifier";
import { PKIX1Explicit88_Extensions } from "./PKIX1Explicit88_Extensions";

export interface PKIX1Explicit88_TBSCertificate {
  version?: PKIX1Explicit88_Version;
  serialnumber: PKIX1Explicit88_CertificateSerialNumber;
  signature: PKIX1Explicit88_AlgorithmIdentifier;
  issuer: PKIX1Explicit88_Name;
  validity: PKIX1Explicit88_Validity;
  subject: PKIX1Explicit88_Name;
  subjectpublickeyinfo: PKIX1Explicit88_SubjectPublicKeyInfo;
  issueruniqueid?: PKIX1Explicit88_UniqueIdentifier;
  subjectuniqueid?: PKIX1Explicit88_UniqueIdentifier;
  extensions?: PKIX1Explicit88_Extensions;
}
