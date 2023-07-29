/* eslint-disable no-unused-vars */
import { ReactElement } from "react";
import { ReviewTranscript, Transcript } from "../../../types";

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
  modifier: (data: ReviewTranscript) => any;
  action?: (data: ReviewTranscript) => void;
  isDisabled?: boolean;
  isDisabledText?: string;
  component?: (data: ReviewTranscript) => ReactElement;
};

export type TableDataElement = {
  tableItem: TableStructure;
  row: ReviewTranscript;
  actionState?: {
    rowId: number;
  };
};
