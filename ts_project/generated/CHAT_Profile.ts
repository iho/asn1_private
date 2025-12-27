
import { CHAT_Contact } from "./CHAT_Contact";
import { CHAT_Server } from "./CHAT_Server";
import { CHAT_Feature } from "./CHAT_Feature";
import { CHAT_Roster } from "./CHAT_Roster";

export interface CHAT_Profile {
  nickname: any;
  phone: any;
  session: any;
  chats: CHAT_Contact[];
  contacts: CHAT_Contact[];
  keys: any[];
  servers: CHAT_Server[];
  settings: CHAT_Feature[];
  update: number;
  status: number;
  roster: CHAT_Roster;
}
