
import { KEP_OtherHash } from "./KEP_OtherHash";
import { KEP_CrlIdentifier } from "./KEP_CrlIdentifier";

export interface KEP_CrlValidatedID {
  crlhash: KEP_OtherHash;
  crlidentifier?: KEP_CrlIdentifier;
}
