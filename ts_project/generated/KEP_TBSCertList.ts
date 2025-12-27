
import { AuthenticationFramework_Version } from "./AuthenticationFramework_Version";
import { AuthenticationFramework_AlgorithmIdentifier } from "./AuthenticationFramework_AlgorithmIdentifier";
import { InformationFramework_Name } from "./InformationFramework_Name";
import { KEP_Time } from "./KEP_Time";
import { AuthenticationFramework_Extensions } from "./AuthenticationFramework_Extensions";

export interface KEP_TBSCertList {
  version?: AuthenticationFramework_Version;
  signature: AuthenticationFramework_AlgorithmIdentifier;
  issuer: InformationFramework_Name;
  thisupdate: KEP_Time;
  nextupdate?: KEP_Time;
  revokedcertificates?: any[];
  crlextensions?: AuthenticationFramework_Extensions;
}
