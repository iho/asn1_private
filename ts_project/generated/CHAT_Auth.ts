
import { CHAT_AuthType } from "./CHAT_AuthType";
import { CHAT_OS } from "./CHAT_OS";
import { CHAT_Feature } from "./CHAT_Feature";

export interface CHAT_Auth {
  session: any;
  type: CHAT_AuthType;
  sms_code: any;
  cert: any;
  challange: any;
  push: any;
  os: CHAT_OS;
  nickname: any;
  settings: CHAT_Feature[];
  token: any;
  devkey: any;
  phone: any;
}
