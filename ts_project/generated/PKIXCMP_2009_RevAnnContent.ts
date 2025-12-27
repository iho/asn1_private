
import { PKIXCMP_2009_PKIStatus } from "./PKIXCMP_2009_PKIStatus";
import { PKIXCRMF_2009_CertId } from "./PKIXCRMF_2009_CertId";

export interface PKIXCMP_2009_RevAnnContent {
  status: PKIXCMP_2009_PKIStatus;
  certid: PKIXCRMF_2009_CertId;
  willberevokedat: Date;
  badsincedate: Date;
  crldetails?: any;
}
