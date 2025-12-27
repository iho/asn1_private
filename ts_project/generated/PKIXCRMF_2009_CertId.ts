
import { PKIX1Implicit_2009_GeneralName } from "./PKIX1Implicit_2009_GeneralName";

export interface PKIXCRMF_2009_CertId {
  issuer: PKIX1Implicit_2009_GeneralName;
  serialnumber: number;
}
