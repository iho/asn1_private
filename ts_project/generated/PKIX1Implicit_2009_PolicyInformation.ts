
import { PKIX1Implicit_2009_CertPolicyId } from "./PKIX1Implicit_2009_CertPolicyId";
import { PKIX1Implicit_2009_PolicyQualifierInfo } from "./PKIX1Implicit_2009_PolicyQualifierInfo";

export interface PKIX1Implicit_2009_PolicyInformation {
  policyidentifier: PKIX1Implicit_2009_CertPolicyId;
  policyqualifiers?: PKIX1Implicit_2009_PolicyQualifierInfo[];
}
