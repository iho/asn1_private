
import { InformationFramework_Name } from "./InformationFramework_Name";

export interface DirectoryAbstractService_EntryInformation {
  name: InformationFramework_Name;
  fromentry?: boolean;
  information?: any[];
  incompleteentry?: boolean;
  partialnameresolution?: boolean;
}
