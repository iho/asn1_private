
import { LDAPDN } from "./LDAPDN";
import { LDAP_AttributeList } from "./LDAP_AttributeList";

export interface LDAP_AddRequest {
  entry: LDAPDN;
  attributes: LDAP_AttributeList;
}
