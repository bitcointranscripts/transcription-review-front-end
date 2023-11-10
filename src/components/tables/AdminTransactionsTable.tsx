import { Flex, Text } from "@chakra-ui/react";
import { AdminTransaction } from "../../../types";
import BaseTable from "./BaseTable";
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
    name: "username",
    type: "text-short",
    modifier: (data) => data.wallet?.user?.githubUsername,
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
] satisfies TableStructure<AdminTransaction>[];

const EmptyView = ({ hasFilters }: { hasFilters: boolean }) => {
  return (
    <Flex w="full" justifyContent="center" alignItems="center" gap={2}>
      <Text>
        {hasFilters
          ? "No transactions found for the set criteria"
          : "No transactions found"}
      </Text>
    </Flex>
  );
};

type Props = {
  isLoading: boolean;
  isError: boolean;
  hasFilters: boolean;
  transactions: AdminTransaction[] | undefined;
};

const AdminTransactionsTable = ({
  isLoading,
  isError,
  hasFilters,
  transactions,
}: Props) => {
  return (
    <>
      <BaseTable
        data={transactions}
        emptyView={<EmptyView hasFilters={hasFilters} />}
        isLoading={isLoading}
        isError={isError}
        tableStructure={tableStructure}
      />
    </>
  );
};

export default AdminTransactionsTable;
