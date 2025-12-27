
import { DirectoryAbstractService_SecurityParameters } from "./DirectoryAbstractService_SecurityParameters";
import { InformationFramework_DistinguishedName } from "./InformationFramework_DistinguishedName";
import { InformationFramework_Attribute } from "./InformationFramework_Attribute";

export interface DirectoryAbstractService_CommonResults {
  securityparameters?: DirectoryAbstractService_SecurityParameters;
  performer?: InformationFramework_DistinguishedName;
  aliasdereferenced?: boolean;
  notification?: InformationFramework_Attribute[];
}
