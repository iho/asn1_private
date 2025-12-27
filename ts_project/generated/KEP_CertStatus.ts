
import { KEP_RevokedInfo } from "./KEP_RevokedInfo";
import { KEP_UnknownInfo } from "./KEP_UnknownInfo";

export interface KEP_CertStatus {
  good?: null;
  revoked?: KEP_RevokedInfo;
  unknown?: KEP_UnknownInfo;
}
