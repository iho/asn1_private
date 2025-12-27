
import { InformationFramework_Name } from "./InformationFramework_Name";
import { InformationFramework_AttributeType } from "./InformationFramework_AttributeType";

export interface AuthenticationFramework_AttributeCertificateAssertion {
  subject?: any;
  issuer?: InformationFramework_Name;
  attcertvalidity?: Date;
  atttype?: InformationFramework_AttributeType[];
}
