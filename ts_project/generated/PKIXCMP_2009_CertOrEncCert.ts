
import { PKIXCMP_2009_CMPCertificate } from "./PKIXCMP_2009_CMPCertificate";
import { PKIXCRMF_2009_EncryptedValue } from "./PKIXCRMF_2009_EncryptedValue";

export interface PKIXCMP_2009_CertOrEncCert {
  certificate?: PKIXCMP_2009_CMPCertificate;
  encryptedcert?: PKIXCRMF_2009_EncryptedValue;
}
