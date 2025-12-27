
import { InformationFramework_DistinguishedName } from "./InformationFramework_DistinguishedName";
import { SelectedAttributeTypes_UniqueIdentifier } from "./SelectedAttributeTypes_UniqueIdentifier";

export interface SelectedAttributeTypes_NameAndOptionalUID {
  dn: InformationFramework_DistinguishedName;
  uid?: SelectedAttributeTypes_UniqueIdentifier;
}
