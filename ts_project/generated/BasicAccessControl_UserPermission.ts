
import { BasicAccessControl_Precedence } from "./BasicAccessControl_Precedence";
import { BasicAccessControl_ProtectedItems } from "./BasicAccessControl_ProtectedItems";
import { BasicAccessControl_GrantsAndDenials } from "./BasicAccessControl_GrantsAndDenials";

export interface BasicAccessControl_UserPermission {
  precedence?: BasicAccessControl_Precedence;
  protecteditems: BasicAccessControl_ProtectedItems;
  grantsanddenials: BasicAccessControl_GrantsAndDenials;
}
