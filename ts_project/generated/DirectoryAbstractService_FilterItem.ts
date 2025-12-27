
import { InformationFramework_AttributeValueAssertion } from "./InformationFramework_AttributeValueAssertion";
import { InformationFramework_AttributeType } from "./InformationFramework_AttributeType";
import { DirectoryAbstractService_MatchingRuleAssertion } from "./DirectoryAbstractService_MatchingRuleAssertion";
import { InformationFramework_AttributeTypeAssertion } from "./InformationFramework_AttributeTypeAssertion";

export interface DirectoryAbstractService_FilterItem {
  equality?: InformationFramework_AttributeValueAssertion;
  substrings?: any;
  greaterorequal?: InformationFramework_AttributeValueAssertion;
  lessorequal?: InformationFramework_AttributeValueAssertion;
  present?: InformationFramework_AttributeType;
  approximatematch?: InformationFramework_AttributeValueAssertion;
  extensiblematch?: DirectoryAbstractService_MatchingRuleAssertion;
  contextpresent?: InformationFramework_AttributeTypeAssertion;
}
