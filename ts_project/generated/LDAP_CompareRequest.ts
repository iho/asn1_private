
import { LDAPDN } from "./LDAPDN";
import { LDAP_AttributeValueAssertion } from "./LDAP_AttributeValueAssertion";

export interface LDAP_CompareRequest {
  entry: LDAPDN;
  ava: LDAP_AttributeValueAssertion;
}
