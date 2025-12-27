
import { PKIXCMP_2009_CMPCertificate } from "./PKIXCMP_2009_CMPCertificate";
import { PKIXCMP_2009_CertResponse } from "./PKIXCMP_2009_CertResponse";

export interface PKIXCMP_2009_CertRepMessage {
  capubs?: PKIXCMP_2009_CMPCertificate[];
  response: PKIXCMP_2009_CertResponse[];
}
