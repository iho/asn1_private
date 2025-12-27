
import { CHAT_Contact } from "./CHAT_Contact";
import { CHAT_Room } from "./CHAT_Room";
import { CHAT_RosterStatus } from "./CHAT_RosterStatus";

export interface CHAT_Roster {
  id: any;
  nickname: any;
  update: number;
  contacts: CHAT_Contact[];
  topics: CHAT_Room[];
  status: CHAT_RosterStatus;
}
