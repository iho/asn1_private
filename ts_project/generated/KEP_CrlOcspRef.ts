
import { KEP_CRLListID } from "./KEP_CRLListID";
import { KEP_OcspListID } from "./KEP_OcspListID";
import { KEP_OtherRevRefs } from "./KEP_OtherRevRefs";

export interface KEP_CrlOcspRef {
  crlids?: KEP_CRLListID;
  ocspids?: KEP_OcspListID;
  otherrev?: KEP_OtherRevRefs;
}
