
import { PKIXCMP_2009_PKIStatusInfo } from "./PKIXCMP_2009_PKIStatusInfo";
import { PKIXCMP_2009_PKIFreeText } from "./PKIXCMP_2009_PKIFreeText";

export interface PKIXCMP_2009_ErrorMsgContent {
  pkistatusinfo: PKIXCMP_2009_PKIStatusInfo;
  errorcode?: number;
  errordetails?: PKIXCMP_2009_PKIFreeText;
}
