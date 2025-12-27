
import { CHAT_Criteria } from "./CHAT_Criteria";
import { CHAT_Scope } from "./CHAT_Scope";
import { CHAT_SearchStatus } from "./CHAT_SearchStatus";

export interface CHAT_Search {
  dn: any;
  id: any;
  field: any;
  value: any;
  criteria: CHAT_Criteria;
  type: CHAT_Scope;
  status: CHAT_SearchStatus;
}
