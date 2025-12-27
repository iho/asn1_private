
import { LDAP_AttributeDescription } from "./LDAP_AttributeDescription";

export interface LDAP_SubstringFilter {
  type: LDAP_AttributeDescription;
  substrings: any[];
}
