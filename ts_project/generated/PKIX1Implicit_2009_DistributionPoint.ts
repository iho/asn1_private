
import { PKIX1Implicit_2009_DistributionPointName } from "./PKIX1Implicit_2009_DistributionPointName";
import { PKIX1Implicit_2009_ReasonFlags } from "./PKIX1Implicit_2009_ReasonFlags";
import { PKIX1Implicit_2009_GeneralNames } from "./PKIX1Implicit_2009_GeneralNames";

export interface PKIX1Implicit_2009_DistributionPoint {
  distributionpoint?: PKIX1Implicit_2009_DistributionPointName;
  reasons?: PKIX1Implicit_2009_ReasonFlags;
  crlissuer?: PKIX1Implicit_2009_GeneralNames;
}
