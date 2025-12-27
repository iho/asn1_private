
import { DirectoryAbstractService_FilterItem } from "./DirectoryAbstractService_FilterItem";

export interface DirectoryAbstractService_Filter {
  item?: DirectoryAbstractService_FilterItem;
  and?: DirectoryAbstractService_Filter[];
  or?: DirectoryAbstractService_Filter[];
  not?: DirectoryAbstractService_Filter;
}
