
import { AuthenticationFramework_Version } from "./AuthenticationFramework_Version";
import { KEP_ResponderID } from "./KEP_ResponderID";
import { KEP_SingleResponse } from "./KEP_SingleResponse";
import { AuthenticationFramework_Extensions } from "./AuthenticationFramework_Extensions";

export interface KEP_ResponseData {
  version?: AuthenticationFramework_Version;
  responderid: KEP_ResponderID;
  producedat: Date;
  responses: KEP_SingleResponse[];
  responseextensions?: AuthenticationFramework_Extensions;
}
