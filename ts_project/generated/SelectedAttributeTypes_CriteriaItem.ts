
import { InformationFramework_AttributeType } from "./InformationFramework_AttributeType";

export interface SelectedAttributeTypes_CriteriaItem {
  equality?: InformationFramework_AttributeType;
  substrings?: InformationFramework_AttributeType;
  greaterorequal?: InformationFramework_AttributeType;
  lessorequal?: InformationFramework_AttributeType;
  approximatematch?: InformationFramework_AttributeType;
}
