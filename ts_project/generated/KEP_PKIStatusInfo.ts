
import { KEP_PKIStatus } from "./KEP_PKIStatus";
import { KEP_PKIFreeText } from "./KEP_PKIFreeText";
import { KEP_PKIFailureInfo } from "./KEP_PKIFailureInfo";

export interface KEP_PKIStatusInfo {
  status: KEP_PKIStatus;
  statusstring?: KEP_PKIFreeText;
  failinfo?: KEP_PKIFailureInfo;
}
