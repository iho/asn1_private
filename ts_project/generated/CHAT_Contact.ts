
import { CHAT_Message } from "./CHAT_Message";
import { CHAT_PresenceType } from "./CHAT_PresenceType";
import { CHAT_Feature } from "./CHAT_Feature";
import { CHAT_Service } from "./CHAT_Service";
import { CHAT_ContactStatus } from "./CHAT_ContactStatus";

export interface CHAT_Contact {
  nickname: any;
  avatar: any;
  names: any[];
  phone_id: any;
  surnames: any[];
  last_msg: CHAT_Message;
  presence: CHAT_PresenceType;
  update: number;
  created: number;
  settings: CHAT_Feature[];
  services: CHAT_Service[];
  status: CHAT_ContactStatus;
}
