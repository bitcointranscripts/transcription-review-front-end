import {
  Button,
  Flex,
  Heading,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { BiChevronDown } from "react-icons/bi";
import { IoIosFunnel } from "react-icons/io";
import { useGetTransactions } from "@/services/api/admin";
import { useRouter } from "next/router";
import {
  FilterQueryNames,
  TransactionStatus,
  TransactionType,
} from "@/config/default";
import AdminTransactionsTable from "@/components/tables/AdminTransactionsTable";
import Pagination from "@/components/tables/Pagination";
import { useDebouncedCallback } from "use-debounce";
import { UI_CONFIG } from "@/config/ui-config";
import { RefetchButton } from "@/components/tables/TableItems";
import { useHasPermission } from "@/hooks/useHasPermissions";
import AuthStatus from "@/components/transcript/AuthStatus";

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

const Transactions = () => {
  const router = useRouter();
  const queryString = router.asPath.split("?").slice(1).join("");
  const urlParams = new URLSearchParams(queryString);

  const canAccessTransactions = useHasPermission("accessTransactions");

  const userFilter = urlParams.get(FilterQueryNames.user);
  const txIdFilter = urlParams.get(FilterQueryNames.txId);
  const typeFilter = urlParams.get(FilterQueryNames.type);
  const statusFilter = urlParams.get(FilterQueryNames.status);
  const pageQuery = urlParams.get(FilterQueryNames.page);

  const {
    data: transactionResponse,
    isLoading,
    isError,
    refetch,
  } = useGetTransactions({
    userInfo: userFilter,
    txId: txIdFilter,
    type: typeFilter,
    status: statusFilter,
    page: pageQuery,
  });

  const { data, totalPages, totalTransactions, page } =
    transactionResponse ?? {};

  const sortedData = data?.sort((a, b) => {
    if (a.createdAt > b.createdAt) return -1;
    if (a.createdAt < b.createdAt) return 1;
    return 0;
  });

  const resetFilters = () => {
    router.push(router.pathname, undefined, {
      shallow: true,
    });
  };

  const removeFilter = (filterName: string) => {
    urlParams.delete(filterName);
    router.push(router.pathname + "?" + urlParams.toString(), undefined, {
      shallow: true,
    });
  };

  const showReset = urlParams.size > 0;

  const handleFilterSelect = <T extends string>(name: string, item: T) => {
    urlParams.set(name, item);
    router.push(router.pathname + "?" + urlParams.toString(), undefined, {
      shallow: true,
    });
  };

  const debounceSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.trim();
      const name = e.target.name;
      if (val !== "") {
        handleFilterSelect(name, val);
      } else {
        if (urlParams.get(name)) {
          removeFilter(name);
        }
      }
    },
    UI_CONFIG.DEBOUNCE_DELAY
  );

  if (!canAccessTransactions) {
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
        <Flex
          gap={6}
          wrap="wrap"
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Flex basis="500px" gap={2} grow={{ base: 1, md: 0 }}>
            <Input
              name={FilterQueryNames.user}
              onChange={debounceSearch}
              placeholder="Search by username or email"
            />
            <Input
              name={FilterQueryNames.txId}
              onChange={debounceSearch}
              placeholder="Search by transaction Id"
            />
          </Flex>
          <Flex gap={4} alignItems={"center"}>
            <Flex gap={1} alignItems="center" color={"orange.500"}>
              <Text
                textTransform="capitalize"
                fontWeight="bold"
                fontSize="14px"
              >
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
            {refetch && <RefetchButton refetch={refetch} />}
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
            <Text fontWeight="bold" fontSize="14px" color="gray.500">
              Results: {totalTransactions ?? 0}
            </Text>
          </Flex>
        </Flex>
        <AdminTransactionsTable
          transactions={sortedData ?? []}
          isError={isError}
          isLoading={isLoading}
          hasFilters={showReset}
        />
        {totalPages && page ? (
          <Pagination
            pages={totalPages}
            setCurrentPage={() => {}}
            currentPage={page}
          />
        ) : null}
      </Flex>
      {/* <WalletAlert isOpen={isOpen} onCancel={onClose} refetch={refetch} /> */}
    </>
  );
};

export default Transactions;
