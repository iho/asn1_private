
import { InformationFramework_MRMapping } from "./InformationFramework_MRMapping";

export interface InformationFramework_RelaxationPolicy {
  basic?: InformationFramework_MRMapping;
  tightenings?: InformationFramework_MRMapping[];
  relaxations?: InformationFramework_MRMapping[];
  maximum?: number;
  minimum?: number;
}
