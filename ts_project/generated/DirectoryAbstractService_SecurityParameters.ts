
import { AuthenticationFramework_CertificationPath } from "./AuthenticationFramework_CertificationPath";
import { InformationFramework_DistinguishedName } from "./InformationFramework_DistinguishedName";
import { DirectoryAbstractService_Time } from "./DirectoryAbstractService_Time";
import { DirectoryAbstractService_ProtectionRequest } from "./DirectoryAbstractService_ProtectionRequest";
import { DirectoryAbstractService_Code } from "./DirectoryAbstractService_Code";
import { AuthenticationFramework_AttributeCertificationPath } from "./AuthenticationFramework_AttributeCertificationPath";
import { DirectoryAbstractService_ErrorProtectionRequest } from "./DirectoryAbstractService_ErrorProtectionRequest";

export interface DirectoryAbstractService_SecurityParameters {
  certification_path?: AuthenticationFramework_CertificationPath;
  name?: InformationFramework_DistinguishedName;
  time?: DirectoryAbstractService_Time;
  random?: any;
  target?: DirectoryAbstractService_ProtectionRequest;
  response?: any;
  operationcode?: DirectoryAbstractService_Code;
  attributecertificationpath?: AuthenticationFramework_AttributeCertificationPath;
  errorprotection?: DirectoryAbstractService_ErrorProtectionRequest;
  errorcode?: DirectoryAbstractService_Code;
}
