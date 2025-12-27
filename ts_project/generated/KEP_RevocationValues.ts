
import { AuthenticationFramework_CertificateList } from "./AuthenticationFramework_CertificateList";
import { KEP_BasicOCSPResponse } from "./KEP_BasicOCSPResponse";
import { KEP_OtherRevVals } from "./KEP_OtherRevVals";

export interface KEP_RevocationValues {
  crlvals?: AuthenticationFramework_CertificateList[];
  ocspvals?: KEP_BasicOCSPResponse[];
  otherrevvals?: KEP_OtherRevVals;
}
