
import { PKIXCMP_2009_PKIFreeText } from "./PKIXCMP_2009_PKIFreeText";

export interface PKIXCMP_2009_PollRepContent_Element {
  certreqid: number;
  checkafter: number;
  reason?: PKIXCMP_2009_PKIFreeText;
}
