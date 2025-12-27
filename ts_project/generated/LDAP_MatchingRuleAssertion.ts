
import { LDAP_MatchingRuleId } from "./LDAP_MatchingRuleId";
import { LDAP_AttributeDescription } from "./LDAP_AttributeDescription";
import { LDAP_AssertionValue } from "./LDAP_AssertionValue";

export interface LDAP_MatchingRuleAssertion {
  matchingrule?: LDAP_MatchingRuleId;
  type?: LDAP_AttributeDescription;
  matchvalue: LDAP_AssertionValue;
  dnattributes?: boolean;
}
