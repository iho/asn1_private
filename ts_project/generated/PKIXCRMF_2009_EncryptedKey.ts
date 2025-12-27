
import { PKIXCRMF_2009_EncryptedValue } from "./PKIXCRMF_2009_EncryptedValue";
import { CryptographicMessageSyntax_2009_EnvelopedData } from "./CryptographicMessageSyntax_2009_EnvelopedData";

export interface PKIXCRMF_2009_EncryptedKey {
  encryptedvalue?: PKIXCRMF_2009_EncryptedValue;
  envelopeddata?: CryptographicMessageSyntax_2009_EnvelopedData;
}
