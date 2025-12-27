
import { BasicAccessControl_Precedence } from "./BasicAccessControl_Precedence";
import { BasicAccessControl_AuthenticationLevel } from "./BasicAccessControl_AuthenticationLevel";

export interface BasicAccessControl_ACIItem {
  identificationtag: any;
  precedence: BasicAccessControl_Precedence;
  authenticationlevel: BasicAccessControl_AuthenticationLevel;
  itemoruserfirst: any;
}
