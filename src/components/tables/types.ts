import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query";
import { ReactElement } from "react";

export type tableStructureItemType =
  | "date"
  | "text-long"
  | "text-short"
  | "tags"
  | "default"
  | "action";

export type TableStructure<T> = {
  name: string;
  actionName?: string;
  type: tableStructureItemType;
  modifier: (data: T) => any;
  action?: (data: T) => void;
  isDisabled?: boolean;
  isDisabledText?: string;
  component?: (data: T) => ReactElement;
};

export type TableDataElement<T> = {
  tableItem: TableStructure<T>;
  row: T;
};

export type TableData<T> = {
  data: T;
};

export type Refetch = <TPageData>(
  options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
) => Promise<QueryObserverResult<any, unknown>>;
