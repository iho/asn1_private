
import { PKIXCRMF_2009_CertTemplate } from "./PKIXCRMF_2009_CertTemplate";
import { PKIXCRMF_2009_Controls } from "./PKIXCRMF_2009_Controls";

export interface PKIXCRMF_2009_CertRequest {
  certreqid: number;
  certtemplate: PKIXCRMF_2009_CertTemplate;
  controls?: PKIXCRMF_2009_Controls;
}
