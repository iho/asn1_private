
import { DSTU_AlgorithmIdentifier } from "./DSTU_AlgorithmIdentifier";

export interface DSTU_SubjectPublicKeyInfo {
  algorithm: DSTU_AlgorithmIdentifier;
  subjectpublickey: any;
}
