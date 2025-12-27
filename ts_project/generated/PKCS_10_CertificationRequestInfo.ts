
import { PKIX1Explicit_2009_Name } from "./PKIX1Explicit_2009_Name";

export interface PKCS_10_CertificationRequestInfo {
  version: any;
  subject: PKIX1Explicit_2009_Name;
  subjectpkinfo: any;
  attributes: any;
}
