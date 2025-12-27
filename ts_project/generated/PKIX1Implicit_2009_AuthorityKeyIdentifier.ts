
import { PKIX1Implicit_2009_KeyIdentifier } from "./PKIX1Implicit_2009_KeyIdentifier";
import { PKIX1Implicit_2009_GeneralNames } from "./PKIX1Implicit_2009_GeneralNames";
import { PKIX1Explicit_2009_CertificateSerialNumber } from "./PKIX1Explicit_2009_CertificateSerialNumber";

export interface PKIX1Implicit_2009_AuthorityKeyIdentifier {
  keyidentifier?: PKIX1Implicit_2009_KeyIdentifier;
  authoritycertissuer?: PKIX1Implicit_2009_GeneralNames;
  authoritycertserialnumber?: PKIX1Explicit_2009_CertificateSerialNumber;
}
