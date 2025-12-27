
import { PKIXCRMF_2009_POPOSigningKey } from "./PKIXCRMF_2009_POPOSigningKey";
import { PKIXCRMF_2009_POPOPrivKey } from "./PKIXCRMF_2009_POPOPrivKey";

export interface PKIXCRMF_2009_ProofOfPossession {
  raverified?: null;
  signature?: PKIXCRMF_2009_POPOSigningKey;
  keyencipherment?: PKIXCRMF_2009_POPOPrivKey;
  keyagreement?: PKIXCRMF_2009_POPOPrivKey;
}
