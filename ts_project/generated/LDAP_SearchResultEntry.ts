
import { LDAPDN } from "./LDAPDN";
import { LDAP_PartialAttributeList } from "./LDAP_PartialAttributeList";

export interface LDAP_SearchResultEntry {
  objectname: LDAPDN;
  attributes: LDAP_PartialAttributeList;
}
