
import { InformationFramework_ContextProfile } from "./InformationFramework_ContextProfile";
import { InformationFramework_ContextCombination } from "./InformationFramework_ContextCombination";
import { InformationFramework_MatchingUse } from "./InformationFramework_MatchingUse";

export interface InformationFramework_RequestAttribute {
  attributetype: any;
  includesubtypes?: boolean;
  selectedvalues?: any[];
  defaultvalues?: any[];
  contexts?: InformationFramework_ContextProfile[];
  contextcombination?: InformationFramework_ContextCombination;
  matchinguse?: InformationFramework_MatchingUse[];
}
