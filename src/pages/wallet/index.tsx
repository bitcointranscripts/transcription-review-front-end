import { useSession } from "next-auth/react";
import React from "react";

import RedirectToLogin from "@/components/RedirectToLogin";
import { payInvoice, useGetWallet } from "@/services/api/wallet";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";

const Wallet = () => {
  const { status, data: sessionData } = useSession();
  const sessionDataId = sessionData?.user?.id;
  const toast = useToast();
  const [invoiceInput, setInvoiceInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const { data: walletData, isLoading, refetch } = useGetWallet(sessionDataId);

  const pasteInvoice = () => {
    navigator.clipboard.readText().then((text) => {
      setInvoiceInput(text);
    });
  };

  const handlePayment = async () => {
    if (invoiceInput === "") {
      return;
    }
    setLoading(true);
    const response = await payInvoice(sessionDataId, invoiceInput);
    if (
      response?.response?.status >= 400 ||
      response?.response?.status <= 500
    ) {
      setLoading(false);
      toast({
        title: "Error",
        description: response.response.data.error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    setInvoiceInput("");
    setLoading(false);
    refetch();
    toast({
      title: "Paid",
      description: "We've paid your invoice. Keep reviewing!",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  if (status === "unauthenticated" || !sessionData?.user?.id) {
    return <RedirectToLogin />;
  }

  if (isLoading || !walletData) {
    return <div>Loading...</div>;
  }

  return (
    <Flex flexDir="row" gap={16} width="full">
      <Flex flexDir="column">
        <Box mb="4">
          <strong>Wallet</strong>
          <Text>Balance: {walletData.balance}</Text>
          <Text>id: {walletData.id}</Text>
        </Box>
        <Box>
          <strong>Transactions</strong>
          {walletData.transactions.length > 0 ? (
            walletData.transactions.map((transaction) => (
              <ul key={transaction.id}>
                <li>id: {transaction.id}</li>
                <p>amount: {transaction.amount}</p>
                <p>type: {transaction.transactionType}</p>
                <p>status: {transaction.transactionStatus}</p>
                <p>createdAt: {transaction.createdAt}</p>
              </ul>
            ))
          ) : (
            <p>No transactions</p>
          )}
        </Box>
      </Flex>
      <Box>
        <strong>Withdraw</strong>
        <InputGroup size="md">
          <Input
            width={"500px"}
            pr="4.5rem"
            type="text"
            placeholder="Enter a lightning invoice"
            value={invoiceInput}
            disabled={loading}
            onChange={(e) => setInvoiceInput(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={pasteInvoice}>
              Paste
            </Button>
          </InputRightElement>
        </InputGroup>
        <Button
          mt="4"
          colorScheme="teal"
          size="md"
          disabled={loading || invoiceInput === ""}
          isLoading={loading}
          onClick={handlePayment}
        >
          Withdraw
        </Button>
      </Box>
    </Flex>
  );
};

export default Wallet;
