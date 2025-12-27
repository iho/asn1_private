
import { KEP_CertPolicyId } from "./KEP_CertPolicyId";
import { KEP_PolicyQualifierInfo } from "./KEP_PolicyQualifierInfo";

export interface KEP_PolicyInformation {
  policyidentifier: KEP_CertPolicyId;
  policyqualifiers?: KEP_PolicyQualifierInfo[];
}
