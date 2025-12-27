
import { KEP_OcspIdentifier } from "./KEP_OcspIdentifier";
import { KEP_OtherHash } from "./KEP_OtherHash";

export interface KEP_OcspResponsesID {
  ocspidentifier: KEP_OcspIdentifier;
  ocsprephash?: KEP_OtherHash;
}
