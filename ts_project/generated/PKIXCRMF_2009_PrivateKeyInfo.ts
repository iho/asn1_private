
import { PKIXCRMF_2009_Attributes } from "./PKIXCRMF_2009_Attributes";

export interface PKIXCRMF_2009_PrivateKeyInfo {
  version: number;
  privatekeyalgorithm: any;
  privatekey: any;
  attributes?: PKIXCRMF_2009_Attributes;
}
