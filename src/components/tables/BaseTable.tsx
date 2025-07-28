import {
  Box,
  Checkbox,
  CheckboxGroup,
  Flex,
  Heading,
  Table,
  Tbody,
  Thead,
  Tr,
  Td,
} from "@chakra-ui/react";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query";
import React from "react";
import {
  DataEmpty,
  LoadingSkeleton,
  RefetchButton,
  RowData,
  TableHeader,
} from "./TableItems";
import type { TableStructure } from "./types";

type Props<T> = {
  actionItems?: JSX.Element;
  data: T[] | undefined;
  emptyView?: React.ReactNode;
  isLoading: boolean;
  isError: boolean;
  refetch?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<any, unknown>>;
  tableStructure: TableStructure<T>[];
  tableHeader?: string;
  tableHeaderComponent?: React.ReactNode;
  enableCheckboxes?: boolean;
  selectedRowIds?: string[];
  onSelectedRowIdsChange?: (selectedRowIds: string[]) => void;
  getRowId?: (row: T) => string;
};

const BaseTable = <T extends object>({
  actionItems,
  data,
  emptyView,
  isLoading,
  refetch,
  tableStructure,
  tableHeader,
  tableHeaderComponent,
  enableCheckboxes = false, // Default to no checkboxes
  selectedRowIds = [],
  onSelectedRowIdsChange: setSelectedIds,
  getRowId,
}: Props<T>) => {
  return (
    <Box fontSize="sm" py={4} isolation="isolate">
      {tableHeaderComponent
        ? tableHeaderComponent
        : tableHeader && (
            <Heading size="md" mb={6}>
              {tableHeader}
            </Heading>
          )}
      <Flex gap={2} justifyContent="flex-end" mb={2}>
        {actionItems}
        {refetch && <RefetchButton refetch={refetch} />}
      </Flex>
      <CheckboxGroup
        colorScheme="orange"
        value={selectedRowIds}
        onChange={setSelectedIds}
      >
        <Table
          boxShadow="lg"
          borderTop="4px solid"
          borderTopColor="orange.400"
          borderRadius="xl"
        >
          <Thead>
            <TableHeader
              tableStructure={tableStructure}
              showCheckboxes={enableCheckboxes}
            />
          </Thead>
          <Tbody fontWeight="medium">
            {isLoading ? (
              <LoadingSkeleton
                rowsLength={tableStructure.length + (enableCheckboxes ? 1 : 0)}
              />
            ) : !data ? (
              <DataEmpty />
            ) : data?.length ? (
              data.map((dataRow, idx) => (
                <TableRow
                  key={getRowId ? getRowId(dataRow) : idx}
                  row={dataRow}
                  ts={tableStructure}
                  enableCheckboxes={enableCheckboxes}
                  rowId={getRowId ? getRowId(dataRow) : `${idx}`}
                />
              ))
            ) : (
              <DataEmpty message={emptyView} />
            )}
          </Tbody>
        </Table>
      </CheckboxGroup>
    </Box>
  );
};

const TableRow = <T extends object>({
  row,
  ts,
  enableCheckboxes,
  rowId,
}: {
  row: T;
  ts: TableStructure<T>[];
  enableCheckboxes: boolean;
  rowId: string;
}) => {
  return (
    <Tr>
      {enableCheckboxes && (
        <Td>
          <Checkbox value={rowId} key={rowId} width="1%" />
        </Td>
      )}
      {ts.map((tableItem) => (
        <RowData key={tableItem.name} tableItem={tableItem} row={row} />
      ))}
    </Tr>
  );
};

export default BaseTable;
