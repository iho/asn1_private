
import { PKCS_10_CertificationRequestInfo } from "./PKCS_10_CertificationRequestInfo";

export interface PKCS_10_CertificationRequest {
  certificationrequestinfo: PKCS_10_CertificationRequestInfo;
  signaturealgorithm: any;
  signature: any;
}
