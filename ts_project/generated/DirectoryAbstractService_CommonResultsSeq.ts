
import { DirectoryAbstractService_SecurityParameters } from "./DirectoryAbstractService_SecurityParameters";
import { InformationFramework_DistinguishedName } from "./InformationFramework_DistinguishedName";

export interface DirectoryAbstractService_CommonResultsSeq {
  securityparameters?: DirectoryAbstractService_SecurityParameters;
  performer?: InformationFramework_DistinguishedName;
  aliasdereferenced?: boolean;
}
