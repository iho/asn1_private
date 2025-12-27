
import { PKIX1Explicit_2009_Version } from "./PKIX1Explicit_2009_Version";
import { PKIX1Explicit_2009_Name } from "./PKIX1Explicit_2009_Name";
import { PKIXCRMF_2009_OptionalValidity } from "./PKIXCRMF_2009_OptionalValidity";
import { PKIX1Explicit_2009_SubjectPublicKeyInfo } from "./PKIX1Explicit_2009_SubjectPublicKeyInfo";
import { PKIX1Explicit_2009_UniqueIdentifier } from "./PKIX1Explicit_2009_UniqueIdentifier";

export interface PKIXCRMF_2009_CertTemplate {
  version?: PKIX1Explicit_2009_Version;
  serialnumber?: number;
  signingalg?: any;
  issuer?: PKIX1Explicit_2009_Name;
  validity?: PKIXCRMF_2009_OptionalValidity;
  subject?: PKIX1Explicit_2009_Name;
  publickey?: PKIX1Explicit_2009_SubjectPublicKeyInfo;
  issueruid?: PKIX1Explicit_2009_UniqueIdentifier;
  subjectuid?: PKIX1Explicit_2009_UniqueIdentifier;
  extensions?: any;
}
