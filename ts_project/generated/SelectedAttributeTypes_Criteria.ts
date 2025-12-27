
import { SelectedAttributeTypes_CriteriaItem } from "./SelectedAttributeTypes_CriteriaItem";

export interface SelectedAttributeTypes_Criteria {
  type?: SelectedAttributeTypes_CriteriaItem;
  and?: SelectedAttributeTypes_Criteria[];
  or?: SelectedAttributeTypes_Criteria[];
  not?: SelectedAttributeTypes_Criteria;
}
