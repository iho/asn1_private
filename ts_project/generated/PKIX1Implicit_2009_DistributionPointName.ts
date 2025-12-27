
import { PKIX1Implicit_2009_GeneralNames } from "./PKIX1Implicit_2009_GeneralNames";
import { PKIX1Explicit_2009_RelativeDistinguishedName } from "./PKIX1Explicit_2009_RelativeDistinguishedName";

export interface PKIX1Implicit_2009_DistributionPointName {
  fullname?: PKIX1Implicit_2009_GeneralNames;
  namerelativetocrlissuer?: PKIX1Explicit_2009_RelativeDistinguishedName;
}
