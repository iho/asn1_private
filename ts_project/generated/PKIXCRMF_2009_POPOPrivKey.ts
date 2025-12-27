
import { PKIXCRMF_2009_SubsequentMessage } from "./PKIXCRMF_2009_SubsequentMessage";
import { PKIXCRMF_2009_PKMACValue } from "./PKIXCRMF_2009_PKMACValue";
import { CryptographicMessageSyntax_2009_EnvelopedData } from "./CryptographicMessageSyntax_2009_EnvelopedData";

export interface PKIXCRMF_2009_POPOPrivKey {
  thismessage?: any;
  subsequentmessage?: PKIXCRMF_2009_SubsequentMessage;
  dhmac?: any;
  agreemac?: PKIXCRMF_2009_PKMACValue;
  encryptedkey?: CryptographicMessageSyntax_2009_EnvelopedData;
}
