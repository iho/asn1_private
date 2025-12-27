
import { PKIXCMP_2009_PKIStatusInfo } from "./PKIXCMP_2009_PKIStatusInfo";
import { PKIXCRMF_2009_CertId } from "./PKIXCRMF_2009_CertId";
import { PKIX1Explicit_2009_CertificateList } from "./PKIX1Explicit_2009_CertificateList";

export interface PKIXCMP_2009_RevRepContent {
  status: PKIXCMP_2009_PKIStatusInfo[];
  revcerts?: PKIXCRMF_2009_CertId[];
  crls?: PKIX1Explicit_2009_CertificateList[];
}
