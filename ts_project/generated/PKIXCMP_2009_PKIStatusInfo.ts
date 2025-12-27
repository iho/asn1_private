
import { PKIXCMP_2009_PKIStatus } from "./PKIXCMP_2009_PKIStatus";
import { PKIXCMP_2009_PKIFreeText } from "./PKIXCMP_2009_PKIFreeText";
import { PKIXCMP_2009_PKIFailureInfo } from "./PKIXCMP_2009_PKIFailureInfo";

export interface PKIXCMP_2009_PKIStatusInfo {
  status: PKIXCMP_2009_PKIStatus;
  statusstring?: PKIXCMP_2009_PKIFreeText;
  failinfo?: PKIXCMP_2009_PKIFailureInfo;
}
