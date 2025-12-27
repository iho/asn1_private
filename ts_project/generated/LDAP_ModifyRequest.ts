
import { LDAPDN } from "./LDAPDN";

export interface LDAP_ModifyRequest {
  object: LDAPDN;
  changes: any[];
}
