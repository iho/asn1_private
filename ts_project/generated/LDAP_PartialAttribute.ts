
import { LDAP_AttributeDescription } from "./LDAP_AttributeDescription";
import { LDAP_AttributeValue } from "./LDAP_AttributeValue";

export interface LDAP_PartialAttribute {
  type: LDAP_AttributeDescription;
  vals: LDAP_AttributeValue[];
}
