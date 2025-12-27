
import { PKIX1Implicit_2009_GeneralName } from "./PKIX1Implicit_2009_GeneralName";
import { PKIX1Implicit_2009_KeyIdentifier } from "./PKIX1Implicit_2009_KeyIdentifier";
import { PKIXCMP_2009_PKIFreeText } from "./PKIXCMP_2009_PKIFreeText";
import { PKIXCMP_2009_InfoTypeAndValue } from "./PKIXCMP_2009_InfoTypeAndValue";

export interface PKIXCMP_2009_PKIHeader {
  pvno: any;
  sender: PKIX1Implicit_2009_GeneralName;
  recipient: PKIX1Implicit_2009_GeneralName;
  messagetime?: Date;
  protectionalg?: any;
  senderkid?: PKIX1Implicit_2009_KeyIdentifier;
  recipkid?: PKIX1Implicit_2009_KeyIdentifier;
  transactionid?: any;
  sendernonce?: any;
  recipnonce?: any;
  freetext?: PKIXCMP_2009_PKIFreeText;
  generalinfo?: PKIXCMP_2009_InfoTypeAndValue[];
}
