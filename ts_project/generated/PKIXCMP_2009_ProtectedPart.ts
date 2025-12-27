
import { PKIXCMP_2009_PKIHeader } from "./PKIXCMP_2009_PKIHeader";
import { PKIXCMP_2009_PKIBody } from "./PKIXCMP_2009_PKIBody";

export interface PKIXCMP_2009_ProtectedPart {
  header: PKIXCMP_2009_PKIHeader;
  body: PKIXCMP_2009_PKIBody;
}
