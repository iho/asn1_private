
import { InformationFramework_LocalName } from "./InformationFramework_LocalName";
import { InformationFramework_Refinement } from "./InformationFramework_Refinement";

export interface InformationFramework_SubtreeSpecification {
  base?: InformationFramework_LocalName;

  specificationfilter?: InformationFramework_Refinement;
}
