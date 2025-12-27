
import { PKIXCRMF_2009_EncryptedKey } from "./PKIXCRMF_2009_EncryptedKey";
import { PKIXCRMF_2009_KeyGenParameters } from "./PKIXCRMF_2009_KeyGenParameters";

export interface PKIXCRMF_2009_PKIArchiveOptions {
  encryptedprivkey?: PKIXCRMF_2009_EncryptedKey;
  keygenparameters?: PKIXCRMF_2009_KeyGenParameters;
  archiveremgenprivkey?: boolean;
}
