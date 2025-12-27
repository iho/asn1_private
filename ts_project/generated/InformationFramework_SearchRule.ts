
import { InformationFramework_RequestAttribute } from "./InformationFramework_RequestAttribute";
import { InformationFramework_AttributeCombination } from "./InformationFramework_AttributeCombination";
import { InformationFramework_ResultAttribute } from "./InformationFramework_ResultAttribute";
import { InformationFramework_ControlOptions } from "./InformationFramework_ControlOptions";
import { DirectoryAbstractService_FamilyGrouping } from "./DirectoryAbstractService_FamilyGrouping";
import { DirectoryAbstractService_FamilyReturn } from "./DirectoryAbstractService_FamilyReturn";
import { InformationFramework_RelaxationPolicy } from "./InformationFramework_RelaxationPolicy";
import { InformationFramework_AttributeType } from "./InformationFramework_AttributeType";
import { InformationFramework_AllowedSubset } from "./InformationFramework_AllowedSubset";
import { InformationFramework_ImposedSubset } from "./InformationFramework_ImposedSubset";
import { InformationFramework_EntryLimit } from "./InformationFramework_EntryLimit";

export interface InformationFramework_SearchRule {

  servicetype?: any;
  userclass?: number;
  inputattributetypes?: InformationFramework_RequestAttribute[];
  attributecombination?: InformationFramework_AttributeCombination;
  outputattributetypes?: InformationFramework_ResultAttribute[];
  defaultcontrols?: InformationFramework_ControlOptions;
  mandatorycontrols?: InformationFramework_ControlOptions;
  searchrulecontrols?: InformationFramework_ControlOptions;
  familygrouping?: DirectoryAbstractService_FamilyGrouping;
  familyreturn?: DirectoryAbstractService_FamilyReturn;
  relaxation?: InformationFramework_RelaxationPolicy;
  additionalcontrol?: InformationFramework_AttributeType[];
  allowedsubset?: InformationFramework_AllowedSubset;
  imposedsubset?: InformationFramework_ImposedSubset;
  entrylimit?: InformationFramework_EntryLimit;
}
