
import { PKIXCMP_2009_PKIStatusInfo } from "./PKIXCMP_2009_PKIStatusInfo";

export interface PKIXCMP_2009_CertStatus {
  certhash: any;
  certreqid: number;
  statusinfo?: PKIXCMP_2009_PKIStatusInfo;
}
