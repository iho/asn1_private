
import { PKIX1Implicit_2009_GeneralName } from "./PKIX1Implicit_2009_GeneralName";
import { PKIX1Implicit_2009_BaseDistance } from "./PKIX1Implicit_2009_BaseDistance";

export interface PKIX1Implicit_2009_GeneralSubtree {
  base: PKIX1Implicit_2009_GeneralName;
  minimum?: PKIX1Implicit_2009_BaseDistance;
  maximum?: PKIX1Implicit_2009_BaseDistance;
}
