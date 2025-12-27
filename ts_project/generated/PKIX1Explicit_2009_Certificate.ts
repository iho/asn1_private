
import { PKIX1Explicit_2009_Certificate_toBeSigned } from "./PKIX1Explicit_2009_Certificate_toBeSigned";
import { PKIX1Explicit_2009_AlgorithmIdentifier } from "./PKIX1Explicit_2009_AlgorithmIdentifier";

export interface PKIX1Explicit_2009_Certificate {
  tobesigned: PKIX1Explicit_2009_Certificate_toBeSigned;
  algorithmidentifier: PKIX1Explicit_2009_AlgorithmIdentifier;
  encrypted: any;
}
