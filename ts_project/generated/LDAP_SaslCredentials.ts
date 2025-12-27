
import { LDAPString } from "./LDAPString";

export interface LDAP_SaslCredentials {
  mechanism: LDAPString;
  credentials?: any;
}
