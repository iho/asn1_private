
import { InformationFramework_Name } from "./InformationFramework_Name";

export interface KEP_GeneralName {
  othername?: any;
  rfc822name?: string;
  dnsname?: string;
  directoryname?: InformationFramework_Name;
  uniformresourceidentifier?: string;
  ipaddress?: any;
  registeredid?: any;
}
