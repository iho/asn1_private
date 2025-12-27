
import { AuthenticationFramework_Version } from "./AuthenticationFramework_Version";
import { AuthenticationFramework_AlgorithmIdentifier } from "./AuthenticationFramework_AlgorithmIdentifier";
import { InformationFramework_Name } from "./InformationFramework_Name";
import { AuthenticationFramework_Time } from "./AuthenticationFramework_Time";
import { AuthenticationFramework_Extensions } from "./AuthenticationFramework_Extensions";

export interface AuthenticationFramework_CertificateList_toBeSigned {
  version?: AuthenticationFramework_Version;
  signature: AuthenticationFramework_AlgorithmIdentifier;
  issuer: InformationFramework_Name;
  thisupdate: AuthenticationFramework_Time;
  nextupdate?: AuthenticationFramework_Time;
  revokedcertificates?: any[];
  crlextensions?: AuthenticationFramework_Extensions;
}
