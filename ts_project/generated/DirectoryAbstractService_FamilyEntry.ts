
import { InformationFramework_RelativeDistinguishedName } from "./InformationFramework_RelativeDistinguishedName";
import { DirectoryAbstractService_FamilyEntries } from "./DirectoryAbstractService_FamilyEntries";

export interface DirectoryAbstractService_FamilyEntry {
  rdn: InformationFramework_RelativeDistinguishedName;
  information: any[];
  family_info?: DirectoryAbstractService_FamilyEntries[];
}
