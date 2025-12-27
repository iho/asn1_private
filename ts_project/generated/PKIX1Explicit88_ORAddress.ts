
import { PKIX1Explicit88_BuiltInStandardAttributes } from "./PKIX1Explicit88_BuiltInStandardAttributes";
import { PKIX1Explicit88_BuiltInDomainDefinedAttributes } from "./PKIX1Explicit88_BuiltInDomainDefinedAttributes";
import { PKIX1Explicit88_ExtensionAttributes } from "./PKIX1Explicit88_ExtensionAttributes";

export interface PKIX1Explicit88_ORAddress {
  built_in_standard_attributes: PKIX1Explicit88_BuiltInStandardAttributes;
  built_in_domain_defined_attributes?: PKIX1Explicit88_BuiltInDomainDefinedAttributes;
  extension_attributes?: PKIX1Explicit88_ExtensionAttributes;
}
