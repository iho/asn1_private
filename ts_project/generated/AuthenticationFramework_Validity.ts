
import { AuthenticationFramework_Time } from "./AuthenticationFramework_Time";

export interface AuthenticationFramework_Validity {
  notbefore: AuthenticationFramework_Time;
  notafter: AuthenticationFramework_Time;
}
