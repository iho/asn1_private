
import { CHAT_Feature } from "./CHAT_Feature";
import { CHAT_Service } from "./CHAT_Service";
import { CHAT_PresenceType } from "./CHAT_PresenceType";
import { CHAT_MemberStatus } from "./CHAT_MemberStatus";

export interface CHAT_Member {
  id: number;
  feed_id: any;
  feeds: any[];
  phone_id: any;
  avatar: any;
  names: any[];
  surnames: any[];
  alias: any;
  update: number;
  settings: CHAT_Feature[];
  services: CHAT_Service[];
  presence: CHAT_PresenceType;
  status: CHAT_MemberStatus;
}
