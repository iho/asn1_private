
import { InformationFramework_AttributeType } from "./InformationFramework_AttributeType";

export interface InformationFramework_AttributeCombination {
  attribute?: InformationFramework_AttributeType;
  and?: InformationFramework_AttributeCombination[];
  or?: InformationFramework_AttributeCombination[];
  not?: InformationFramework_AttributeCombination;
}
