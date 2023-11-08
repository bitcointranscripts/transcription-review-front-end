import {
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { BiChevronDown } from "react-icons/bi";
import { IoIosFunnel } from "react-icons/io";
import TransactionsTable from "@/components/tables/TransactionsTable";

import { TransactionQueryStatus, TransactionQueryType } from "../../../types";
import AuthStatus from "@/components/transcript/AuthStatus";
import { useGetTransactions } from "@/services/api/admin";
import { useRouter } from "next/router";
import { TransactionStatus, TransactionType } from "@/config/default";

// eslint-disable-next-line no-unused-vars
type OnSelect<T> = (name: string, item: T) => void;

const FilterItem = ({ text }: { text: string }) => (
  <Flex userSelect={"none"} gap={1} alignItems={"center"}>
    <Text textTransform="capitalize" fontWeight="bold" fontSize="14px">
      {text}
    </Text>
    <BiChevronDown />
  </Flex>
);

const SelectFilter = <T extends string>({
  hasValue,
  onSelect,
  options,
  name,
}: {
  hasValue: boolean;
  onSelect: OnSelect<T>;
  options: T[];
  name: string;
}) => {
  return (
    <Menu>
      <MenuButton color={hasValue ? "orange.500" : undefined}>
        <FilterItem text={name} />
      </MenuButton>
      <MenuList>
        {options.map((item) => (
          <MenuItem
            textTransform={"capitalize"}
            fontSize="12px"
            fontWeight={"medium"}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(name, item);
            }}
            key={item}
          >
            {item}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

// const DateFilter = ({
//   hasValue,
//   onSelect,
//   text,
// }: {
//   hasValue: boolean;
//   onSelect: OnSelect<Date>;
//   text: string;
// }) => {
//   return (
//     <Flex color={hasValue ? "orange.500" : undefined}>
//       <DatePicker
//         customInput={
//           <Box cursor="pointer">
//             <FilterItem text={text} />
//           </Box>
//         }
//         onChange={onSelect}
//         dateFormat="yyyy-MM-dd"
//       />
//     </Flex>
//   );
// };

const Transactions = () => {
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

  const router = useRouter();
  const queryString = router.asPath.split("?").slice(1).join("");
  const urlParams = new URLSearchParams(queryString);

  const userFilter = urlParams.get("user") ?? undefined;
  const typeFilter =
    (urlParams.get("type") as TransactionQueryType) ?? undefined;
  const statusFilter =
    (urlParams.get("status") as TransactionQueryStatus) ?? undefined;

  const { data: sessionData } = useSession();

  const isAdmin = sessionData?.user?.permissions === "admin";

  const {
    data: transactionResponse,
    isLoading,
    isError,
    refetch,
  } = useGetTransactions({
    userInfo: userFilter,
    type: typeFilter,
    status: statusFilter,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    data,
    hasNextPage,
    hasPreviousPage,
    itemsPerPage,
    totalPages,
    totalTransactions,
    page,
  } = transactionResponse ?? {};

  console.log({ data });

  const resetFilters = () => {
    router.push(router.pathname, undefined, {
      shallow: true,
    });
  };

  const showReset = urlParams.size > 0;

  // if (status === "unauthenticated" || !sessionData?.user?.id) {
  //   return <RedirectToLogin />;
  // }

  const handleFilterSelect = <T extends string>(name: string, item: T) => {
    urlParams.set(name, item);
    router.push(router.pathname + "?" + urlParams.toString(), undefined, {
      shallow: true,
    });
  };

  if (!isAdmin) {
    return (
      <AuthStatus
        title="Unauthorized"
        message="You are not authorized to access this page"
      />
    );
  }

  return (
    <>
      <Flex flexDir="column">
        <Heading size={"md"} mb={10}>
          Transactions
        </Heading>
        {/* <Flex mb={6} alignItems={"center"} gap={2}>
          <Text fontWeight={"bold"}>Balance: </Text>
          {isLoading ? (
            <Spinner color="orange.500" size={"xs"} />
          ) : (
            <Text fontWeight={"medium"}>{balanceText}</Text>
          )}
          <Button
            isDisabled={walletData?.balance === 0 || isLoading}
            variant={"outline"}
            colorScheme={"orange"}
            size={"xs"}
            onClick={onOpen}
          >
            Withdraw
          </Button>
        </Flex> */}
        <Flex gap={6} alignItems={"center"}>
          <Flex gap={1} alignItems="center" color={"orange.500"}>
            <Text textTransform="capitalize" fontWeight="bold" fontSize="14px">
              Filters
            </Text>
            <IoIosFunnel />
          </Flex>
          <SelectFilter
            hasValue={typeFilter != undefined}
            onSelect={handleFilterSelect}
            options={Object.values(TransactionType)}
            name="type"
          />
          <SelectFilter
            hasValue={statusFilter != undefined}
            onSelect={handleFilterSelect}
            options={Object.values(TransactionStatus)}
            name="status"
          />
          {/* <DateFilter
            hasValue={dateFilter != undefined}
            onSelect={setDateFilter}
            text="Date"
          /> */}
          {showReset && (
            <Button
              onClick={resetFilters}
              size={"xs"}
              colorScheme={"red"}
              variant={"outline"}
            >
              Reset
            </Button>
          )}
        </Flex>
        <TransactionsTable
          transactions={data ?? []}
          isError={isError}
          isLoading={isLoading}
          filters={{ date: dateFilter, status: statusFilter, type: typeFilter }}
        />
      </Flex>
      {/* <WalletAlert isOpen={isOpen} onCancel={onClose} refetch={refetch} /> */}
    </>
  );
};

export default Transactions;
