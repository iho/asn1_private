
import { PKIX1Explicit_2009_ORAddress } from "./PKIX1Explicit_2009_ORAddress";
import { PKIX1Explicit_2009_Name } from "./PKIX1Explicit_2009_Name";
import { PKIX1Implicit_2009_EDIPartyName } from "./PKIX1Implicit_2009_EDIPartyName";

export interface PKIX1Implicit_2009_GeneralName {
  othername?: any;
  rfc822name?: string;
  dnsname?: string;
  x400address?: PKIX1Explicit_2009_ORAddress;
  directoryname?: PKIX1Explicit_2009_Name;
  edipartyname?: PKIX1Implicit_2009_EDIPartyName;
  uniformresourceidentifier?: string;
  ipaddress?: any;
  registeredid?: any;
}
