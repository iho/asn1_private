
import { PKIXCMP_2009_PKIStatusInfo } from "./PKIXCMP_2009_PKIStatusInfo";
import { PKIXCMP_2009_CertifiedKeyPair } from "./PKIXCMP_2009_CertifiedKeyPair";

export interface PKIXCMP_2009_CertResponse {
  certreqid: number;
  status: PKIXCMP_2009_PKIStatusInfo;
  certifiedkeypair?: PKIXCMP_2009_CertifiedKeyPair;
  rspinfo?: any;
}
