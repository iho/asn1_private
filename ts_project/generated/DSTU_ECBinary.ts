
import { DSTU_BinaryField } from "./DSTU_BinaryField";

export interface DSTU_ECBinary {
  version?: number;
  f: DSTU_BinaryField;
  a: number;
  b: any;
  n: number;
  bp: any;
}
