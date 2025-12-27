
import { DirectoryAbstractService_ContextSelection } from "./DirectoryAbstractService_ContextSelection";
import { DirectoryAbstractService_FamilyReturn } from "./DirectoryAbstractService_FamilyReturn";

export interface DirectoryAbstractService_EntryInformationSelection {
  attributes?: any;
  infotypes?: any;
  extraattributes?: any;
  contextselection?: DirectoryAbstractService_ContextSelection;
  returncontexts?: boolean;
  familyreturn?: DirectoryAbstractService_FamilyReturn;
}
