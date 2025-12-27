
import { KEP_SigPolicyId } from "./KEP_SigPolicyId";
import { KEP_SigPolicyHash } from "./KEP_SigPolicyHash";

export interface KEP_SignaturePolicyId {
  sigpolicyid: KEP_SigPolicyId;
  sigpolicyhash?: KEP_SigPolicyHash;
}
