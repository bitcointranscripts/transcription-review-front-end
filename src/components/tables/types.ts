/* eslint-disable no-unused-vars */
import { Transcript } from "../../../types";

export type tableStructureItemType =
  | "date"
  | "text-long"
  | "text-short"
  | "tags"
  | "action";

export type TableStructure = {
  name: string;
  actionName?: string;
  type: tableStructureItemType;
  modifier: (data: Transcript) => any;
  action?: (data: Transcript) => void;
  isDisabled?: boolean;
  isDisabledText?: string;
};

export type TableDataElement = {
  tableItem: TableStructure;
  row: Transcript;
  actionState?: {
    rowId: number;
  };
};
