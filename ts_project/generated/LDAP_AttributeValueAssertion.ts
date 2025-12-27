
import { LDAP_AttributeDescription } from "./LDAP_AttributeDescription";
import { LDAP_AssertionValue } from "./LDAP_AssertionValue";

export interface LDAP_AttributeValueAssertion {
  attributedesc: LDAP_AttributeDescription;
  assertionvalue: LDAP_AssertionValue;
}
