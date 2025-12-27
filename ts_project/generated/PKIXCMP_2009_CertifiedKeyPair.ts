
import { PKIXCMP_2009_CertOrEncCert } from "./PKIXCMP_2009_CertOrEncCert";
import { PKIXCRMF_2009_EncryptedValue } from "./PKIXCRMF_2009_EncryptedValue";
import { PKIXCRMF_2009_PKIPublicationInfo } from "./PKIXCRMF_2009_PKIPublicationInfo";

export interface PKIXCMP_2009_CertifiedKeyPair {
  certorenccert: PKIXCMP_2009_CertOrEncCert;
  privatekey?: PKIXCRMF_2009_EncryptedValue;
  publicationinfo?: PKIXCRMF_2009_PKIPublicationInfo;
}
