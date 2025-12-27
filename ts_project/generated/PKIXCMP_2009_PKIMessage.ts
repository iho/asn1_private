
import { PKIXCMP_2009_PKIHeader } from "./PKIXCMP_2009_PKIHeader";
import { PKIXCMP_2009_PKIBody } from "./PKIXCMP_2009_PKIBody";
import { PKIXCMP_2009_PKIProtection } from "./PKIXCMP_2009_PKIProtection";
import { PKIXCMP_2009_CMPCertificate } from "./PKIXCMP_2009_CMPCertificate";

export interface PKIXCMP_2009_PKIMessage {
  header: PKIXCMP_2009_PKIHeader;
  body: PKIXCMP_2009_PKIBody;
  protection?: PKIXCMP_2009_PKIProtection;
  extracerts?: PKIXCMP_2009_CMPCertificate[];
}
