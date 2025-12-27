
import { PKIXCMP_2009_PKIStatusInfo } from "./PKIXCMP_2009_PKIStatusInfo";
import { KEP_TimeStampToken } from "./KEP_TimeStampToken";

export interface KEP_TimeStampResp {
  status: PKIXCMP_2009_PKIStatusInfo;
  timestamptoken?: KEP_TimeStampToken;
}
