
import { KEP_ResponseData } from "./KEP_ResponseData";
import { AuthenticationFramework_AlgorithmIdentifier } from "./AuthenticationFramework_AlgorithmIdentifier";
import { AuthenticationFramework_Certificate } from "./AuthenticationFramework_Certificate";

export interface KEP_BasicOCSPResponse {
  tbsresponsedata: KEP_ResponseData;
  signaturealgorithm: AuthenticationFramework_AlgorithmIdentifier;
  signature: any;
  certs?: AuthenticationFramework_Certificate[];
}
