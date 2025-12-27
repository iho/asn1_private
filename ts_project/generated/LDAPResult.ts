
import { LDAPDN } from "./LDAPDN";
import { LDAPString } from "./LDAPString";
import { LDAP_Referral } from "./LDAP_Referral";

export interface LDAPResult {
  resultcode: any;
  matcheddn: LDAPDN;
  diagnosticmessage: LDAPString;
  referral?: LDAP_Referral;
}
