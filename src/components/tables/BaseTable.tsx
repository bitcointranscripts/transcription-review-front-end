/* eslint-disable no-unused-vars */
import useTranscripts from "@/hooks/useTranscripts";
import {
  Box,
  CheckboxGroup,
  Flex,
  Heading,
  Table,
  Tbody,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useQueryClient,
} from "react-query";
import type { Transcript } from "../../../types";
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
  data: Transcript[] | undefined;
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
};

const BaseTable: React.FC<Props> = ({
  data,
  isLoading,
  refetch,
  actionState,
  tableStructure,
  tableHeader,
  tableHeaderComponent,
  showAdminControls = false,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const toast = useToast();
  const { data: userSession } = useSession();
  const queryClient = useQueryClient();
  const archiveTranscript = useTranscripts().archiveTranscript;

  const handleCheckboxToggle = (values: (string | number)[]) => {
    setSelectedIds(values.map(String));
  };
  const handleArchive = async () => {
    const ids = selectedIds.map(Number);
    try {
      await Promise.all(
        ids.map((transcriptId) =>
          archiveTranscript.mutateAsync({
            transcriptId,
            archivedBy: userSession?.user?.id ?? 0,
          })
        )
      );

      queryClient.invalidateQueries("transcripts");
      toast({
        status: "success",
        title: "Archived successfully",
      });
    } catch (err) {
      const error = err as Error;
      toast({
        status: "error",
        title: "Error while archiving transcript",
        description: error?.message,
      });
    }
  };

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
        {selectedIds.length > 0 && (
          <ArchiveButton
            isArchiving={archiveTranscript.isLoading}
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
        <CheckboxGroup colorScheme="orange" onChange={handleCheckboxToggle}>
          <Tbody fontWeight="medium">
            {isLoading && (
              <LoadingSkeleton rowsLength={tableStructure.length} />
            )}
            {!data ? (
              <DataEmpty />
            ) : data?.length ? (
              data.map((dataRow, idx) => (
                <TableRow
                  showControls={showAdminControls}
                  key={`data-row-${dataRow.id}`}
                  row={dataRow}
                  ts={tableStructure}
                  actionState={actionState}
                />
              ))
            ) : (
              <DataEmpty message="No Data" />
            )}
          </Tbody>
        </CheckboxGroup>
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
  row: Transcript;
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
