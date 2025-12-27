
import { LDAP_SaslCredentials } from "./LDAP_SaslCredentials";

export interface LDAP_AuthenticationChoice {
  simple?: any;
  sasl?: LDAP_SaslCredentials;

}
