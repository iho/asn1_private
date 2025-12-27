
import { KEP_TSAPolicyId } from "./KEP_TSAPolicyId";
import { KEP_MessageImprint } from "./KEP_MessageImprint";
import { KEP_Accuracy } from "./KEP_Accuracy";
import { KEP_GeneralName } from "./KEP_GeneralName";
import { AuthenticationFramework_Extensions } from "./AuthenticationFramework_Extensions";

export interface KEP_TSTInfo {
  version: any;
  policy: KEP_TSAPolicyId;
  messageimprint: KEP_MessageImprint;
  serialnumber: number;
  gentime: Date;
  accuracy?: KEP_Accuracy;
  nonce?: number;
  tsa?: KEP_GeneralName;
  extensions?: AuthenticationFramework_Extensions;
}
