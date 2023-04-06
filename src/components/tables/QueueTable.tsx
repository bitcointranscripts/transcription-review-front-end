/* eslint-disable no-unused-vars */
import { getCount } from "@/utils";
import { Box, Heading, Table, Tbody, Thead, Tr } from "@chakra-ui/react";
import { AxiosResponse } from "axios";
import React from "react";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, UseMutationResult } from "react-query";
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
  handleAction?: (idx: number, row: any) => void;
  claimState?: {
    claim: UseMutationResult<
      AxiosResponse<any, any> | Error,
      unknown,
      {
        userId: number;
        transcriptId: number;
      },
      unknown
    >;
    rowIndex: number;
  };
  tableStructure: TableStructure[];
  tableHeader?: string;
};

const QueueTable: React.FC<Props> = ({ 
  data,
  isLoading,
  isError,
  refetch,
  handleAction,
  claimState,
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

const TableRow = ({ row, ts }: { row: Transcript; ts: TableStructure[] }) => {
  return (
    <Tr>
      {ts.map((tableItem, index) => (
        <RowData
          key={tableItem.name}
          index={index}
          tableItem={tableItem}
          row={row}
        />
      ))}
    </Tr>
  );
};

export default QueueTable;
