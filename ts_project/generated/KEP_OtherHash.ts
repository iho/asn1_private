
import { KEP_OtherHashValue } from "./KEP_OtherHashValue";
import { KEP_OtherHashAlgAndValue } from "./KEP_OtherHashAlgAndValue";

export interface KEP_OtherHash {
  sha1hash?: KEP_OtherHashValue;
  otherhash?: KEP_OtherHashAlgAndValue;
}
