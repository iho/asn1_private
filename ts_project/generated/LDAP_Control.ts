
import { LDAPOID } from "./LDAPOID";

export interface LDAP_Control {
  controltype: LDAPOID;
  criticality?: boolean;
  controlvalue?: any;
}
