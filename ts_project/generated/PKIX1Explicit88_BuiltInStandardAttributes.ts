
import { PKIX1Explicit88_CountryName } from "./PKIX1Explicit88_CountryName";
import { PKIX1Explicit88_AdministrationDomainName } from "./PKIX1Explicit88_AdministrationDomainName";
import { PKIX1Explicit88_NetworkAddress } from "./PKIX1Explicit88_NetworkAddress";
import { PKIX1Explicit88_TerminalIdentifier } from "./PKIX1Explicit88_TerminalIdentifier";
import { PKIX1Explicit88_PrivateDomainName } from "./PKIX1Explicit88_PrivateDomainName";
import { PKIX1Explicit88_OrganizationName } from "./PKIX1Explicit88_OrganizationName";
import { PKIX1Explicit88_NumericUserIdentifier } from "./PKIX1Explicit88_NumericUserIdentifier";
import { PKIX1Explicit88_PersonalName } from "./PKIX1Explicit88_PersonalName";
import { PKIX1Explicit88_OrganizationalUnitNames } from "./PKIX1Explicit88_OrganizationalUnitNames";

export interface PKIX1Explicit88_BuiltInStandardAttributes {
  country_name?: PKIX1Explicit88_CountryName;
  administration_domain_name?: PKIX1Explicit88_AdministrationDomainName;
  network_address?: PKIX1Explicit88_NetworkAddress;
  terminal_identifier?: PKIX1Explicit88_TerminalIdentifier;
  private_domain_name?: PKIX1Explicit88_PrivateDomainName;
  organization_name?: PKIX1Explicit88_OrganizationName;
  numeric_user_identifier?: PKIX1Explicit88_NumericUserIdentifier;
  personal_name?: PKIX1Explicit88_PersonalName;
  organizational_unit_names?: PKIX1Explicit88_OrganizationalUnitNames;
}
