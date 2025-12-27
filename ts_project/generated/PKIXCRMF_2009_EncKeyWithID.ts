
import { PKIXCRMF_2009_PrivateKeyInfo } from "./PKIXCRMF_2009_PrivateKeyInfo";

export interface PKIXCRMF_2009_EncKeyWithID {
  privatekey: PKIXCRMF_2009_PrivateKeyInfo;
  identifier?: any;
}
