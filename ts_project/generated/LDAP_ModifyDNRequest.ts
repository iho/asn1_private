
import { LDAPDN } from "./LDAPDN";
import { LDAP_RelativeLDAPDN } from "./LDAP_RelativeLDAPDN";

export interface LDAP_ModifyDNRequest {
  entry: LDAPDN;
  newrdn: LDAP_RelativeLDAPDN;
  deleteoldrdn: boolean;
  newsuperior?: LDAPDN;
}
