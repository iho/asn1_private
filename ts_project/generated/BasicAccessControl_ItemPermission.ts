
import { BasicAccessControl_Precedence } from "./BasicAccessControl_Precedence";
import { BasicAccessControl_UserClasses } from "./BasicAccessControl_UserClasses";
import { BasicAccessControl_GrantsAndDenials } from "./BasicAccessControl_GrantsAndDenials";

export interface BasicAccessControl_ItemPermission {
  precedence?: BasicAccessControl_Precedence;
  userclasses: BasicAccessControl_UserClasses;
  grantsanddenials: BasicAccessControl_GrantsAndDenials;
}
