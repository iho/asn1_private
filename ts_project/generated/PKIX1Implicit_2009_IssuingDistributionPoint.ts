
import { PKIX1Implicit_2009_DistributionPointName } from "./PKIX1Implicit_2009_DistributionPointName";
import { PKIX1Implicit_2009_ReasonFlags } from "./PKIX1Implicit_2009_ReasonFlags";

export interface PKIX1Implicit_2009_IssuingDistributionPoint {
  distributionpoint?: PKIX1Implicit_2009_DistributionPointName;
  onlycontainsusercerts?: boolean;
  onlycontainscacerts?: boolean;
  onlysomereasons?: PKIX1Implicit_2009_ReasonFlags;
  indirectcrl?: boolean;
  onlycontainsattributecerts?: boolean;
}
