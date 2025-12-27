
import { CertificateExtensions_GeneralName } from "./CertificateExtensions_GeneralName";
import { CertificateExtensions_BaseDistance } from "./CertificateExtensions_BaseDistance";

export interface CertificateExtensions_GeneralSubtree {
  base: CertificateExtensions_GeneralName;
  minimum?: CertificateExtensions_BaseDistance;
  maximum?: CertificateExtensions_BaseDistance;
}
