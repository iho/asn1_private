
import { CHAT_Register } from "./CHAT_Register";
import { CHAT_Auth } from "./CHAT_Auth";
import { CHAT_Feature } from "./CHAT_Feature";
import { CHAT_Service } from "./CHAT_Service";
import { CHAT_Message } from "./CHAT_Message";
import { CHAT_Profile } from "./CHAT_Profile";
import { CHAT_Room } from "./CHAT_Room";
import { CHAT_Member } from "./CHAT_Member";
import { CHAT_Search } from "./CHAT_Search";
import { CHAT_FileDesc } from "./CHAT_FileDesc";
import { CHAT_Typing } from "./CHAT_Typing";
import { CHAT_Friend } from "./CHAT_Friend";
import { CHAT_Presence } from "./CHAT_Presence";
import { CHAT_History } from "./CHAT_History";
import { CHAT_Roster } from "./CHAT_Roster";

export interface CHATProtocol {
  register?: CHAT_Register;
  auth?: CHAT_Auth;
  feature?: CHAT_Feature;
  service?: CHAT_Service;
  message?: CHAT_Message;
  profile?: CHAT_Profile;
  room?: CHAT_Room;
  member?: CHAT_Member;
  search?: CHAT_Search;
  file?: CHAT_FileDesc;
  typing?: CHAT_Typing;
  friend?: CHAT_Friend;
  presence?: CHAT_Presence;
  history?: CHAT_History;
  roster?: CHAT_Roster;
}
