
import { CertificateExtensions_CertPolicyId } from "./CertificateExtensions_CertPolicyId";

export interface CertificateExtensions_PolicyMappingsSyntax_Element {
  issuerdomainpolicy: CertificateExtensions_CertPolicyId;
  subjectdomainpolicy: CertificateExtensions_CertPolicyId;
}
