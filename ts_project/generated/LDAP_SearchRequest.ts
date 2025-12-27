
import { LDAPDN } from "./LDAPDN";
import { LDAP_Filter } from "./LDAP_Filter";
import { LDAP_AttributeSelection } from "./LDAP_AttributeSelection";

export interface LDAP_SearchRequest {
  baseobject: LDAPDN;
  scope: any;
  derefaliases: any;
  sizelimit: number;
  timelimit: number;
  typesonly: boolean;
  filter: LDAP_Filter;
  attributes: LDAP_AttributeSelection;
}
