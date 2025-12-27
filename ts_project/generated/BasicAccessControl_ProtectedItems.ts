
import { InformationFramework_AttributeType } from "./InformationFramework_AttributeType";
import { BasicAccessControl_AttributeTypeAndValue } from "./BasicAccessControl_AttributeTypeAndValue";
import { DirectoryAbstractService_Filter } from "./DirectoryAbstractService_Filter";
import { BasicAccessControl_MaxValueCount } from "./BasicAccessControl_MaxValueCount";
import { BasicAccessControl_RestrictedValue } from "./BasicAccessControl_RestrictedValue";
import { InformationFramework_ContextAssertion } from "./InformationFramework_ContextAssertion";
import { InformationFramework_Refinement } from "./InformationFramework_Refinement";

export interface BasicAccessControl_ProtectedItems {
  entry?: null;
  alluserattributetypes?: null;
  attributetype?: InformationFramework_AttributeType[];
  allattributevalues?: InformationFramework_AttributeType[];
  alluserattributetypesandvalues?: null;
  attributevalue?: BasicAccessControl_AttributeTypeAndValue[];
  selfvalue?: InformationFramework_AttributeType[];
  rangeofvalues?: DirectoryAbstractService_Filter;
  maxvaluecount?: BasicAccessControl_MaxValueCount[];
  maximmsub?: number;
  restrictedby?: BasicAccessControl_RestrictedValue[];
  contexts?: InformationFramework_ContextAssertion[];
  classes?: InformationFramework_Refinement;
}
