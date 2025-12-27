
import { CHAT_Message } from "./CHAT_Message";
import { CHAT_HistoryStatus } from "./CHAT_HistoryStatus";

export interface CHAT_History {
  nickname: any;
  feed: any;
  size: number;
  entity_id: number;
  data: CHAT_Message[];
  status: CHAT_HistoryStatus;
}
