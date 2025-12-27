
import { CHAT_ServiceType } from "./CHAT_ServiceType";
import { CHAT_ServiceStatus } from "./CHAT_ServiceStatus";

export interface CHAT_Service {
  id: any;
  type: CHAT_ServiceType;
  data: any;
  login: any;
  password: any;
  expiration: number;
  status: CHAT_ServiceStatus;
}
