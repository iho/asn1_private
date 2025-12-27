
import { CertificateExtensions_CertPolicyId } from "./CertificateExtensions_CertPolicyId";
import { CertificateExtensions_PolicyQualifierInfo } from "./CertificateExtensions_PolicyQualifierInfo";

export interface CertificateExtensions_PolicyInformation {
  policyidentifier: CertificateExtensions_CertPolicyId;
  policyqualifiers?: CertificateExtensions_PolicyQualifierInfo[];
}
