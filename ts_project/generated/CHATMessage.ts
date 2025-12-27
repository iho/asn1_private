
import { CHATProtocol } from "./CHATProtocol";

export interface CHATMessage {
  no: number;
  headers: any[];
  body: CHATProtocol;
}
