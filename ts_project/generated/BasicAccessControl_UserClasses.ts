
import { SelectedAttributeTypes_NameAndOptionalUID } from "./SelectedAttributeTypes_NameAndOptionalUID";
import { InformationFramework_SubtreeSpecification } from "./InformationFramework_SubtreeSpecification";

export interface BasicAccessControl_UserClasses {
  allusers?: null;
  thisentry?: null;
  name?: SelectedAttributeTypes_NameAndOptionalUID[];
  usergroup?: SelectedAttributeTypes_NameAndOptionalUID[];
  subtree?: InformationFramework_SubtreeSpecification[];
}
