
import { PKIX1Explicit_2009_SubjectPublicKeyInfo } from "./PKIX1Explicit_2009_SubjectPublicKeyInfo";

export interface PKIXCRMF_2009_POPOSigningKeyInput {
  authinfo: any;
  publickey: PKIX1Explicit_2009_SubjectPublicKeyInfo;
}
