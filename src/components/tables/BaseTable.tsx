/* eslint-disable no-unused-vars */
import { Box, Flex, Heading, Table, Tbody, Thead, Tr } from "@chakra-ui/react";
import React from "react";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query";
import type { ReviewTranscript } from "../../../types";
import {
  ArchiveButton,
  DataEmpty,
  LoadingSkeleton,
  RefetchButton,
  RowData,
  TableHeader,
} from "./TableItems";
import type { TableStructure } from "./types";

type Props = {
  data: ReviewTranscript[] | undefined;
  emptyView?: React.ReactNode;
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
  tableHeaderComponent?: React.ReactNode;
  showAdminControls?: boolean;
  handleArchive?: () => Promise<void>;
  isArchiving?: boolean;
  hasAdminSelected?: boolean;
};

const BaseTable: React.FC<Props> = ({
  data,
  emptyView,
  isLoading,
  refetch,
  actionState,
  tableStructure,
  tableHeader,
  tableHeaderComponent,
  showAdminControls = false,
  handleArchive,
  isArchiving,
  hasAdminSelected,
}) => {
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
        {hasAdminSelected && (
          <ArchiveButton
            isArchiving={isArchiving}
            handleArchive={handleArchive}
          />
        )}
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
                key={`data-id-${dataRow.id}-data-row-${idx}`}
                row={dataRow}
                ts={tableStructure}
                actionState={actionState}
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

const TableRow = ({
  row,
  ts,
  actionState,
  showControls,
}: {
  row: ReviewTranscript;
  ts: TableStructure[];
  actionState: Props["actionState"];
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
          actionState={actionState}
        />
      ))}
    </Tr>
  );
};

export default BaseTable;
