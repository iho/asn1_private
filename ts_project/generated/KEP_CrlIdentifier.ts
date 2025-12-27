
import { InformationFramework_Name } from "./InformationFramework_Name";

export interface KEP_CrlIdentifier {
  crlissuer: InformationFramework_Name;
  crlissuedtime: Date;
  crlnumber?: number;
}
