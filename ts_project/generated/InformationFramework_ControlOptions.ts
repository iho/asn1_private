
import { DirectoryAbstractService_ServiceControlOptions } from "./DirectoryAbstractService_ServiceControlOptions";
import { DirectoryAbstractService_SearchControlOptions } from "./DirectoryAbstractService_SearchControlOptions";
import { DirectoryAbstractService_HierarchySelections } from "./DirectoryAbstractService_HierarchySelections";

export interface InformationFramework_ControlOptions {
  servicecontrols?: DirectoryAbstractService_ServiceControlOptions;
  searchoptions?: DirectoryAbstractService_SearchControlOptions;
  hierarchyoptions?: DirectoryAbstractService_HierarchySelections;
}
