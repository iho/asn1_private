
import { KEP_CertID } from "./KEP_CertID";
import { KEP_CertStatus } from "./KEP_CertStatus";
import { AuthenticationFramework_Extensions } from "./AuthenticationFramework_Extensions";

export interface KEP_SingleResponse {
  certid: KEP_CertID;
  certstatus: KEP_CertStatus;
  thisupdate: Date;
  nextupdate?: Date;
  singleextensions?: AuthenticationFramework_Extensions;
}
