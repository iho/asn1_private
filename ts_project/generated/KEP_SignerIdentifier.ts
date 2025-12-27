
import { KEP_IssuerAndSerialNumber } from "./KEP_IssuerAndSerialNumber";
import { KEP_SubjectKeyIdentifier } from "./KEP_SubjectKeyIdentifier";

export interface KEP_SignerIdentifier {
  issuerandserialnumber?: KEP_IssuerAndSerialNumber;
  subjectkeyidentifier?: KEP_SubjectKeyIdentifier;
}
