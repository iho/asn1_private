
import { LDAP_AttributeValueAssertion } from "./LDAP_AttributeValueAssertion";
import { LDAP_SubstringFilter } from "./LDAP_SubstringFilter";
import { LDAP_AttributeDescription } from "./LDAP_AttributeDescription";
import { LDAP_MatchingRuleAssertion } from "./LDAP_MatchingRuleAssertion";

export interface LDAP_Filter {
  and?: LDAP_Filter[];
  or?: LDAP_Filter[];
  not?: LDAP_Filter;
  equalitymatch?: LDAP_AttributeValueAssertion;
  substrings?: LDAP_SubstringFilter;
  greaterorequal?: LDAP_AttributeValueAssertion;
  lessorequal?: LDAP_AttributeValueAssertion;
  present?: LDAP_AttributeDescription;
  approxmatch?: LDAP_AttributeValueAssertion;
  extensiblematch?: LDAP_MatchingRuleAssertion;

}
