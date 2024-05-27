import { Box, Flex, Heading, Table, Tbody, Thead, Tr } from "@chakra-ui/react";
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
  showAdminControls?: boolean;
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
  showAdminControls = false,
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
      <Table
        boxShadow="lg"
        borderTop="4px solid"
        borderTopColor="orange.400"
        borderRadius="xl"
      >
        <Thead>
          <TableHeader tableStructure={tableStructure} />
        </Thead>
        <Tbody fontWeight="medium">
          {isLoading ? (
            <LoadingSkeleton rowsLength={tableStructure.length} />
          ) : !data ? (
            <DataEmpty />
          ) : data?.length ? (
            data.map((dataRow, idx) => (
              <TableRow
                showControls={showAdminControls}
                key={`data-id-${
                  "id" in dataRow ? dataRow.id : ""
                }-data-row-${idx}`}
                row={dataRow}
                ts={tableStructure}
              />
            ))
          ) : (
            <DataEmpty message={emptyView} />
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

const TableRow = <T extends object>({
  row,
  ts,
  showControls,
}: {
  row: T;
  ts: TableStructure<T>[];
  showControls: boolean;
}) => {
  return (
    <Tr>
      {ts.map((tableItem) => (
        <RowData
          showControls={showControls}
          key={tableItem.name}
          tableItem={tableItem}
          row={row}
        />
      ))}
    </Tr>
  );
};

export default BaseTable;
