
import { DirectoryAbstractService_ServiceControls } from "./DirectoryAbstractService_ServiceControls";
import { DirectoryAbstractService_SecurityParameters } from "./DirectoryAbstractService_SecurityParameters";
import { InformationFramework_DistinguishedName } from "./InformationFramework_DistinguishedName";
import { DirectoryAbstractService_OperationProgress } from "./DirectoryAbstractService_OperationProgress";
import { DirectoryAbstractService_ReferenceType } from "./DirectoryAbstractService_ReferenceType";
import { DirectoryAbstractService_ContextSelection } from "./DirectoryAbstractService_ContextSelection";
import { DirectoryAbstractService_FamilyGrouping } from "./DirectoryAbstractService_FamilyGrouping";

export interface DirectoryAbstractService_CommonArguments {
  servicecontrols?: DirectoryAbstractService_ServiceControls;
  securityparameters?: DirectoryAbstractService_SecurityParameters;
  requestor?: InformationFramework_DistinguishedName;
  operationprogress?: DirectoryAbstractService_OperationProgress;
  aliasedrdns?: number;
  criticalextensions?: any;
  referencetype?: DirectoryAbstractService_ReferenceType;
  entryonly?: boolean;
  nameresolveonmaste?: boolean;
  operationcontexts?: DirectoryAbstractService_ContextSelection;
  familygrouping?: DirectoryAbstractService_FamilyGrouping;
}
