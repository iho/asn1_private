
import { PKIX1Explicit88_Version } from "./PKIX1Explicit88_Version";
import { PKIX1Explicit88_AlgorithmIdentifier } from "./PKIX1Explicit88_AlgorithmIdentifier";
import { PKIX1Explicit88_Name } from "./PKIX1Explicit88_Name";
import { PKIX1Explicit88_Time } from "./PKIX1Explicit88_Time";
import { PKIX1Explicit88_Extensions } from "./PKIX1Explicit88_Extensions";

export interface PKIX1Explicit88_TBSCertList {
  version?: PKIX1Explicit88_Version;
  signature: PKIX1Explicit88_AlgorithmIdentifier;
  issuer: PKIX1Explicit88_Name;
  thisupdate: PKIX1Explicit88_Time;
  nextupdate?: PKIX1Explicit88_Time;
  revokedcertificates?: any[];
  crlextensions?: PKIX1Explicit88_Extensions;
}
