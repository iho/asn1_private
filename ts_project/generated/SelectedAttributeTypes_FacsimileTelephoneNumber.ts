
import { SelectedAttributeTypes_TelephoneNumber } from "./SelectedAttributeTypes_TelephoneNumber";
import { SelectedAttributeTypes_G3FacsimileNonBasicParameters } from "./SelectedAttributeTypes_G3FacsimileNonBasicParameters";

export interface SelectedAttributeTypes_FacsimileTelephoneNumber {
  telephonenumber: SelectedAttributeTypes_TelephoneNumber;
  parameters?: SelectedAttributeTypes_G3FacsimileNonBasicParameters;
}
