
import { LDAPOID } from "./LDAPOID";

export interface LDAP_ExtendedRequest {
  requestname: LDAPOID;
  requestvalue?: any;
}
