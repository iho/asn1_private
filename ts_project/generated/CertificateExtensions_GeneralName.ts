
import { InformationFramework_Name } from "./InformationFramework_Name";
import { CertificateExtensions_EDIPartyName } from "./CertificateExtensions_EDIPartyName";

export interface CertificateExtensions_GeneralName {
  othername?: any;
  rfc822name?: string;
  dnsname?: string;
  directoryname?: InformationFramework_Name;
  edipartyname?: CertificateExtensions_EDIPartyName;
  uniformresourceidentifier?: string;
  ipaddress?: any;
  registeredid?: any;
}
