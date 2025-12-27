
import { CHAT_FileDesc } from "./CHAT_FileDesc";
import { CHAT_MessageType } from "./CHAT_MessageType";
import { CHAT_MessageStatus } from "./CHAT_MessageStatus";

export interface CHAT_Message {
  id: any;
  feed_id: any;
  signature: any;
  from: any;
  to: any;
  created: number;
  files: CHAT_FileDesc[];
  type: CHAT_MessageType;
  link: number;
  seenby: any;
  repliedby: any;
  mentioned: any[];
  status: CHAT_MessageStatus;
}
