import {
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BiChevronDown } from "react-icons/bi";
import { IoIosFunnel } from "react-icons/io";

import WalletAlert from "@/components/alerts/WalletAlert";
import RedirectToLogin from "@/components/RedirectToLogin";
import TransactionsTable from "@/components/tables/TransactionsTable";
import { useGetWallet } from "@/services/api/wallet";

import { Transaction } from "../../../types";
import MaintenanceBanner from '@/components/banner/MaintenanceBanner';

type OnSelect<T> = (item: T) => void;

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
  text,
}: {
  hasValue: boolean;
  onSelect: OnSelect<T>;
  options: T[];
  text: string;
}) => {
  return (
    <Menu>
      <MenuButton color={hasValue ? "orange.500" : undefined}>
        <FilterItem text={text} />
      </MenuButton>
      <MenuList>
        {options.map((item) => (
          <MenuItem
            textTransform={"capitalize"}
            fontSize="12px"
            fontWeight={"medium"}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item);
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

const DateFilter = ({
  hasValue,
  onSelect,
  text,
}: {
  hasValue: boolean;
  onSelect: OnSelect<Date>;
  text: string;
}) => {
  return (
    <Flex color={hasValue ? "orange.500" : undefined}>
      <DatePicker
        customInput={
          <Box cursor="pointer">
            <FilterItem text={text} />
          </Box>
        }
        onChange={onSelect}
        dateFormat="yyyy-MM-dd"
      />
    </Flex>
  );
};

const Wallet = () => {
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<
    Transaction["transactionStatus"] | undefined
  >(undefined);
  const [typeFilter, setTypeFilter] = useState<
    Transaction["transactionType"] | undefined
  >(undefined);

  const { status, data: sessionData } = useSession();
  const {
    data: walletData,
    isLoading,
    isError,
    refetch,
  } = useGetWallet(sessionData?.user?.id);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const resetFilters = () => {
    setTypeFilter(undefined);
    setStatusFilter(undefined);
    setDateFilter(undefined);
  };

  const showReset =
    dateFilter !== undefined ||
    statusFilter !== undefined ||
    typeFilter !== undefined;

  const balanceText = useMemo(() => {
    const balance = walletData?.balance ?? 0;

    return `${balance.toLocaleString()} SAT`;
  }, [walletData?.balance]);

  if (status === "unauthenticated" || !sessionData?.user?.id) {
    return <RedirectToLogin />;
  }

  return (
    <>
      <Flex flexDir="column">
        {/* Commented and not deleted incase of an incident and we need the banner again */}
        {/* <MaintenanceBanner /> */}
        <Heading size={"md"} mb={10}>
          My Wallet
        </Heading>
        <Flex mb={6} alignItems={"center"} gap={2}>
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
        </Flex>
        <Flex gap={6} alignItems={"center"}>
          <Flex gap={1} alignItems="center" color={"orange.500"}>
            <Text textTransform="capitalize" fontWeight="bold" fontSize="14px">
              Filters
            </Text>
            <IoIosFunnel />
          </Flex>
          <SelectFilter
            hasValue={typeFilter != undefined}
            onSelect={setTypeFilter}
            options={["credit", "debit"]}
            text="Type"
          />
          <SelectFilter
            hasValue={statusFilter != undefined}
            onSelect={setStatusFilter}
            options={["success", "pending", "failed"]}
            text="Status"
          />
          <DateFilter
            hasValue={dateFilter != undefined}
            onSelect={setDateFilter}
            text="Date"
          />
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
          transactions={walletData?.transactions}
          isError={isError}
          isLoading={isLoading}
          filters={{ date: dateFilter, status: statusFilter, type: typeFilter }}
        />
      </Flex>
      <WalletAlert
        balance={walletData?.balance ?? 0}
        isOpen={isOpen}
        onCancel={onClose}
        refetch={refetch}
      />
    </>
  );
};

export default Wallet;
