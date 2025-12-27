
import { KEP_MessageImprint } from "./KEP_MessageImprint";
import { KEP_TSAPolicyId } from "./KEP_TSAPolicyId";
import { AuthenticationFramework_Extensions } from "./AuthenticationFramework_Extensions";

export interface KEP_TimeStampReq {
  version: any;
  messageimprint: KEP_MessageImprint;
  reqpolicy?: KEP_TSAPolicyId;
  nonce?: number;
  certreq?: boolean;
  extensions?: AuthenticationFramework_Extensions;
}
