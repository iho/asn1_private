
import { CertificateExtensions_GeneralSubtrees } from "./CertificateExtensions_GeneralSubtrees";
import { CertificateExtensions_NameForms } from "./CertificateExtensions_NameForms";

export interface CertificateExtensions_NameConstraintsSyntax {
  permittedsubtrees?: CertificateExtensions_GeneralSubtrees;
  excludedsubtrees?: CertificateExtensions_GeneralSubtrees;
  requirednameforms?: CertificateExtensions_NameForms;
}
