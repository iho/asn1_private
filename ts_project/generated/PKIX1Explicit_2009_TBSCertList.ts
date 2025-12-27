
import { PKIX1Explicit_2009_Version } from "./PKIX1Explicit_2009_Version";
import { PKIX1Explicit_2009_Name } from "./PKIX1Explicit_2009_Name";
import { PKIX1Explicit_2009_Time } from "./PKIX1Explicit_2009_Time";

export interface PKIX1Explicit_2009_TBSCertList {
  version?: PKIX1Explicit_2009_Version;
  signature: any;
  issuer: PKIX1Explicit_2009_Name;
  thisupdate: PKIX1Explicit_2009_Time;
  nextupdate?: PKIX1Explicit_2009_Time;
  revokedcertificates?: any[];


  crlextensions?: any;


}
