
import { SelectedAttributeTypes_DayTimeBand } from "./SelectedAttributeTypes_DayTimeBand";

export interface SelectedAttributeTypes_Period {
  timesofday?: SelectedAttributeTypes_DayTimeBand[];
  days?: any;
  weeks?: any;
  months?: any;
  years?: number[];
}
