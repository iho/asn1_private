
import { PKIXCRMF_2009_CertId } from "./PKIXCRMF_2009_CertId";

export interface PKIXCMP_2009_OOBCertHash {
  hashalg?: any;
  certid?: PKIXCRMF_2009_CertId;
  hashval: any;
}
