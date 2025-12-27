
import { CHAT_Feature } from "./CHAT_Feature";
import { CHAT_Member } from "./CHAT_Member";
import { CHAT_FileDesc } from "./CHAT_FileDesc";
import { CHAT_RoomType } from "./CHAT_RoomType";
import { CHAT_Message } from "./CHAT_Message";
import { CHAT_RoomStatus } from "./CHAT_RoomStatus";

export interface CHAT_Room {
  id: any;
  name: any;
  links: any[];
  description: any;
  settings: CHAT_Feature[];
  members: CHAT_Member[];
  admins: CHAT_Member[];
  data: CHAT_FileDesc[];
  type: CHAT_RoomType;
  tos: any;
  tos_update: number;
  unread: number;
  mentions: number[];
  last_msg: CHAT_Message;
  update: number;
  created: number;
  status: CHAT_RoomStatus;
}
