
import { InformationFramework_RuleIdentifier } from "./InformationFramework_RuleIdentifier";

export interface InformationFramework_DITStructureRule {
  ruleidentifier: InformationFramework_RuleIdentifier;
  nameform: any;
  superiorstructurerules?: InformationFramework_RuleIdentifier[];
}
