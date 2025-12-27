
import { DSTU_Version } from "./DSTU_Version";
import { DSTU_CertificateSerialNumber } from "./DSTU_CertificateSerialNumber";
import { DSTU_AlgorithmIdentifier } from "./DSTU_AlgorithmIdentifier";
import { DSTU_Name } from "./DSTU_Name";
import { DSTU_Validity } from "./DSTU_Validity";
import { DSTU_SubjectPublicKeyInfo } from "./DSTU_SubjectPublicKeyInfo";
import { DSTU_UniqueIdentifier } from "./DSTU_UniqueIdentifier";
import { DSTU_Extensions } from "./DSTU_Extensions";

export interface DSTU_TBSCertificate {
  version?: DSTU_Version;
  serialnumber: DSTU_CertificateSerialNumber;
  signature: DSTU_AlgorithmIdentifier;
  issuer: DSTU_Name;
  validity: DSTU_Validity;
  subject: DSTU_Name;
  subjectpublickeyinfo: DSTU_SubjectPublicKeyInfo;
  issueruniqueid?: DSTU_UniqueIdentifier;
  subjectuniqueid?: DSTU_UniqueIdentifier;
  extensions?: DSTU_Extensions;
}
