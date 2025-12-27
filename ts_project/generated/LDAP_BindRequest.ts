
import { LDAPDN } from "./LDAPDN";
import { LDAP_AuthenticationChoice } from "./LDAP_AuthenticationChoice";

export interface LDAP_BindRequest {
  version: number;
  name: LDAPDN;
  authentication: LDAP_AuthenticationChoice;
}
