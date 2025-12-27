
import { PKIXCMP_2009_PKIStatusInfo } from "./PKIXCMP_2009_PKIStatusInfo";
import { PKIXCMP_2009_CMPCertificate } from "./PKIXCMP_2009_CMPCertificate";
import { PKIXCMP_2009_CertifiedKeyPair } from "./PKIXCMP_2009_CertifiedKeyPair";

export interface PKIXCMP_2009_KeyRecRepContent {
  status: PKIXCMP_2009_PKIStatusInfo;
  newsigcert?: PKIXCMP_2009_CMPCertificate;
  cacerts?: PKIXCMP_2009_CMPCertificate[];
  keypairhist?: PKIXCMP_2009_CertifiedKeyPair[];
}
