
import { LDAP_MessageID } from "./LDAP_MessageID";
import { LDAP_Controls } from "./LDAP_Controls";

export interface LDAPMessage {
  messageid: LDAP_MessageID;
  protocolop: any;
  controls?: LDAP_Controls;
}
