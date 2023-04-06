/* eslint-disable no-unused-vars */
import { Box, Heading, Table, Tbody, Thead, Tr } from "@chakra-ui/react";
import React from "react";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
import type { Transcript } from "../../../types";
import {
  DataEmpty,
  LoadingSkeleton,
  RefetchButton,
  RowData,
  TableHeader,
} from "./TableItems";
import type { TableStructure } from "./types";

type Props = {
  data: Transcript[];
  isLoading: boolean;
  isError: boolean;
  refetch?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<any, unknown>>;
  actionState?: {
    rowId: number;
  };
  tableStructure: TableStructure[];
  tableHeader?: string;
};

const BaseTable: React.FC<Props> = ({
  data,
  isLoading,
  isError,
  refetch,
  actionState,
  tableStructure,
  tableHeader,
}) => {
  return (
    <Box fontSize="sm" py={4} isolation="isolate">
      {tableHeader && (
        <Heading size="md" mb={6}>
          {tableHeader}
        </Heading>
      )}
      {refetch && <RefetchButton refetch={refetch} />}
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
          ) : data?.length ? (
            data.map((dataRow, idx) => (
              <TableRow
                key={`data-row-${dataRow.id}`}
                row={dataRow}
                ts={tableStructure}
                actionState={actionState}
              />
            ))
          ) : (
            <DataEmpty />
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

const TableRow = ({
  row,
  ts,
  actionState,
}: {
  row: Transcript;
  ts: TableStructure[];
  actionState: Props["actionState"];
}) => {
  return (
    <Tr>
      {ts.map((tableItem) => (
        <RowData
          key={tableItem.name}
          tableItem={tableItem}
          row={row}
          actionState={actionState}
        />
      ))}
    </Tr>
  );
};

export default BaseTable;
