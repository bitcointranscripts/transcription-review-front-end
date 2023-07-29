import { usePaginatedResult } from "@/hooks/usePaginatedResult";
import { Button, Flex, Text } from "@chakra-ui/react";
import { isSameDay } from "date-fns";
import { useMemo, useState } from "react";
import { Transaction } from "../../../types";
import BaseTable from "./BaseTable";
import type { TableStructure } from "./types";

const tableStructure = [
  {
    name: "id",
    type: "text-long",
    modifier: (data) => data.id,
  },
  {
    name: "amount",
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
  const [currentPage, setCurrentPage] = useState(1);
  const filteredData = useMemo(
    () =>
      transactions?.filter((item) => {
        const typeMatch =
          filters.type === undefined || item.transactionType === filters.type;
        const statusMatch =
          filters.status === undefined ||
          item.transactionStatus === filters.status;
        const dateMatch =
          filters.date === undefined ||
          isSameDay(new Date(item.createdAt), filters.date);

        return typeMatch && statusMatch && dateMatch;
      }),
    [filters.date, filters.status, filters.type, transactions]
  );
  const pages = useMemo(
    () => Math.ceil((filteredData?.length ?? 0) / pageSize),
    [filteredData?.length]
  );
  const { paginatedResult } = usePaginatedResult(
    filteredData,
    currentPage,
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
      <Flex justifyContent={"center"}>
        {pages > 1 &&
          Array.from({ length: pages }, (_, index) => index + 1).map((item) => (
            <Button
              colorScheme={currentPage === item ? "orange" : "gray"}
              onClick={() => setCurrentPage(item)}
              key={item}
              variant="ghost"
            >
              <Text>{item}</Text>
            </Button>
          ))}
      </Flex>
    </>
  );
};

export default TransactionsTable;
