
import { AuthenticationFramework_AlgorithmIdentifier } from "./AuthenticationFramework_AlgorithmIdentifier";
import { CertificateExtensions_KeyUsage } from "./CertificateExtensions_KeyUsage";
import { CertificateExtensions_CertificatePoliciesSyntax } from "./CertificateExtensions_CertificatePoliciesSyntax";

export interface CertificateExtensions_SupportedAlgorithm {
  algorithmidentifier: AuthenticationFramework_AlgorithmIdentifier;
  intendedusage?: CertificateExtensions_KeyUsage;
  intendedcertificatepolicies?: CertificateExtensions_CertificatePoliciesSyntax;
}
