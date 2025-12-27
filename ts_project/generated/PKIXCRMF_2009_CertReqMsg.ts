
import { PKIXCRMF_2009_CertRequest } from "./PKIXCRMF_2009_CertRequest";
import { PKIXCRMF_2009_ProofOfPossession } from "./PKIXCRMF_2009_ProofOfPossession";

export interface PKIXCRMF_2009_CertReqMsg {
  certreq: PKIXCRMF_2009_CertRequest;
  popo?: PKIXCRMF_2009_ProofOfPossession;
  reginfo?: any[];
}
