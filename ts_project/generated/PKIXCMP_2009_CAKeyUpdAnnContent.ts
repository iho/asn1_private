
import { PKIXCMP_2009_CMPCertificate } from "./PKIXCMP_2009_CMPCertificate";

export interface PKIXCMP_2009_CAKeyUpdAnnContent {
  oldwithnew: PKIXCMP_2009_CMPCertificate;
  newwithold: PKIXCMP_2009_CMPCertificate;
  newwithnew: PKIXCMP_2009_CMPCertificate;
}
