import { usePaginatedResult } from "@/hooks/usePaginatedResult";
import { Flex, Text } from "@chakra-ui/react";
import { isSameDay } from "date-fns";
import { useMemo } from "react";
import { Transaction } from "../../../types";
import BaseTable from "./BaseTable";
import Pagination from "./Pagination";
import type { TableStructure } from "./types";

const tableStructure = [
  {
    name: "id",
    type: "text-long",
    modifier: (data) => data.id,
  },
  {
    name: "amount (SAT)",
    type: "text-short",
    modifier: (data) => data.amount,
  },
  {
    name: "type",
    type: "text-short",
    modifier: (data) => data.transactionType,
  },
  {
    name: "status",
    type: "text-short",
    modifier: (data) => data.transactionStatus,
  },
  { name: "date", type: "date", modifier: (data) => data.createdAt },
] satisfies TableStructure<Transaction>[];

const EmptyView = () => {
  return (
    <Flex w="full" justifyContent="center" alignItems="center" gap={2}>
      <Text>{"You don't have any transactions"}</Text>
    </Flex>
  );
};

type Props = {
  isLoading: boolean;
  isError: boolean;
  filters: {
    date?: Date;
    type?: Transaction["transactionType"];
    status?: Transaction["transactionStatus"];
  };
  transactions: Transaction[] | undefined;
};

const pageSize = 10;

const TransactionsTable = ({
  isLoading,
  isError,
  filters,
  transactions,
}: Props) => {
  const transformedData = useMemo(
    () =>
      transactions
        ?.filter((item) => {
          const typeMatch =
            filters.type === undefined || item.transactionType === filters.type;
          const statusMatch =
            filters.status === undefined ||
            item.transactionStatus === filters.status;
          const dateMatch =
            filters.date === undefined ||
            isSameDay(new Date(item.createdAt), filters.date);

          return typeMatch && statusMatch && dateMatch;
        })
        ?.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    [filters.date, filters.status, filters.type, transactions]
  );
  const pages = useMemo(
    () => Math.ceil((transformedData?.length ?? 0) / pageSize),
    [transformedData?.length]
  );
  const { currentPage, paginatedResult, setCurrentPage } = usePaginatedResult(
    transformedData,
    pageSize
  );

  return (
    <>
      <BaseTable
        data={paginatedResult}
        emptyView={<EmptyView />}
        isLoading={isLoading}
        isError={isError}
        tableStructure={tableStructure}
      />
      <Pagination
        currentPage={currentPage}
        pages={pages}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default TransactionsTable;
