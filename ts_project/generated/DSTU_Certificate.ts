
import { DSTU_TBSCertificate } from "./DSTU_TBSCertificate";
import { DSTU_AlgorithmIdentifier } from "./DSTU_AlgorithmIdentifier";

export interface DSTU_Certificate {
  tbscertificate: DSTU_TBSCertificate;
  signaturealgorithm: DSTU_AlgorithmIdentifier;
  signaturevalue: any;
}
