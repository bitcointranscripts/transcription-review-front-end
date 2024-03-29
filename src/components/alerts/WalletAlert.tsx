import "react-datepicker/dist/react-datepicker.css";

import { useSession } from "next-auth/react";
import { ChangeEvent, useRef, useState } from "react";

import {
  usePayInvoice,
  useValidateAddress,
  useWithdrawSats,
} from "@/services/api/wallet";
import { validateInvoice } from "@/utils/invoice";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  refetch: () => void;
  balance: number;
};
export type LightningResponse = {
  status: string;
  tag: string;
  commentAllowed: number;
  callback: string;
  metadata: string;
  minSendable: number;
  maxSendable: number;
  payerData: PayerData;
  nostrPubkey: string;
  allowsNostr: boolean;
};

export type PayerData = {
  name: Email;
  email: Email;
  pubkey: Email;
};

export type Email = {
  mandatory: boolean;
};

const WalletAlert = ({ isOpen, onCancel, refetch, balance }: Props) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  const { data: sessionData } = useSession();
  const sessionDataId = sessionData?.user?.id;
  const toast = useToast();
  const [invoiceInput, setInvoiceInput] = useState("");
  const [amountToSend, setAmountToSend] = useState<number>(0);
  const [step, setStep] = useState(1);
  const [lightningData, setLightningData] = useState<LightningResponse>();
  const [error, setError] = useState("");
  const payInvoice = usePayInvoice();
  const withdrawSats = useWithdrawSats();
  const validateAddress = useValidateAddress();

  // A Regex to check if the lightning address is valid
  const lnAddressCheck = /^[a-z0-9\-_.]+@[a-z0-9\-_.]+/;

  // A Regex to check if the lightning invoice is valid
  const lnInvoiceCheck =
    /^ln([a-z0-9]+)1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]+[a-z0-9]?$/;
  const handleClose = () => {
    setError("");
    setInvoiceInput("");
    onCancel();
    setStep(1);
  };

  // function to withdraw sats with invoice
  const withdrawSatsWithInvoice = (invoice: string, userID: number) => {
    const validateInvoiceResult = validateInvoice(invoice);
    if (!validateInvoiceResult.success) {
      setError(validateInvoiceResult.message);
      toast({
        title: "Error",
        description: validateInvoiceResult.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    withdrawSats.mutate(
      {
        invoice: invoice,
        userId: userID,
      },
      {
        onSuccess: (response) => {
          if (
            response?.response?.status >= 400 ||
            response?.response?.status <= 500
          ) {
            toast({
              title: "Error",
              description:
                response.response.data.error ||
                "unable to make payment, try again later",
              status: "error",
              duration: 9000,
              isClosable: true,
            });
            return;
          }
          handleClose();
          refetch();
          toast({
            title: "Paid",
            description: "Payment successful. Keep reviewing!",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          setStep(1);
        },
      }
    );
  };
  const handleAddressValidation = (e: ChangeEvent<HTMLInputElement>) => {
    const lnAddress = e.target.value;

    if (lnAddress.match(lnAddressCheck)) {
      setError("");
    }
    setInvoiceInput(e.target.value);
  };
  const pasteInvoice = () => {
    navigator.clipboard.readText().then((text) => {
      setInvoiceInput(text);
    });
  };

  const handleValidation = async () => {
    if (invoiceInput === "") {
      return;
    }
    if (invoiceInput.match(lnInvoiceCheck)) {
      withdrawSatsWithInvoice(invoiceInput, sessionDataId as number);
      return;
    }
    if (!invoiceInput.match(lnAddressCheck)) {
      setError("not a valid lightning address / invoice");
      return;
    }
    validateAddress.mutate(
      {
        lnAddress: invoiceInput,
      },
      {
        onSuccess: (response) => {
          if (
            response?.response?.status >= 400 ||
            response?.response?.status <= 500
          ) {
            toast({
              title: "Error",
              description:
                response.response?.data?.message || "Something went wrong!",
              status: "error",
              duration: 9000,
              isClosable: true,
            });
            return;
          }
          if (response.metadata) {
            const metadataArray = JSON.parse(response.metadata);
            const addressPosition =
              metadataArray
                .flat()
                .findIndex((elm: string) => elm.includes("text/identifier")) +
              1;
            if (metadataArray.flat()[addressPosition] === invoiceInput) {
              setLightningData(response as LightningResponse);
              setStep(2);
            }
            return;
          }
        },
      }
    );
  };

  const handleWithdrawAmount = (e: ChangeEvent<HTMLInputElement>) => {
    let sendingAmount = e.target.value;

    if (sendingAmount.match(/^[0-9]+$/)) {
      // turn into a number type
      setAmountToSend(Number(sendingAmount));
    } else {
      if (sendingAmount.length === 0) {
        setAmountToSend(0);
      }
    }
  };

  const handleWithdrawalValidation = () => {
    const amountToSendParsed = Number(amountToSend || 0);
    const isWithinBalance = Number(amountToSendParsed) <= Number(balance);
    const minimumSendable = (lightningData?.minSendable || 1000) / 1000;
    const maximumSendable = (lightningData?.maxSendable || 1000) / 1000;
    const isWithinSendable =
      Number(amountToSendParsed) >= minimumSendable &&
      amountToSendParsed <= maximumSendable;
    setError("");
    if (!isWithinBalance) {
      setError(
        "Insufficient balance: send sats lower than your wallet balance"
      );
      return;
    }

    if (!isWithinSendable) {
      setError(
        `Error: send sats within range of ${minimumSendable} and ${maximumSendable}`
      );
      return;
    }
    payInvoice.mutate(
      {
        amount: Number(amountToSend),
        callbackUrl: lightningData?.callback as string,
      },
      {
        onSuccess: (response) => {
          if (
            !response?.pr ||
            response?.response?.status >= 400 ||
            response?.response?.status <= 500
          ) {
            toast({
              title: "Error",
              description:
                response.response?.data?.message || "Something went wrong!",
              status: "error",
              duration: 9000,
              isClosable: true,
            });
            return;
          }
          withdrawSatsWithInvoice(response.pr, sessionDataId as number);
        },
      }
    );
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={handleClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Withdraw
          </AlertDialogHeader>
          {step === 1 && (
            <AlertDialogBody>
              <Box mb={"4"}>
                <InputGroup size="md">
                  <Input
                    width={"500px"}
                    pr="4.5rem"
                    type="text"
                    placeholder="Enter a lightning address or invoice"
                    value={invoiceInput}
                    disabled={validateAddress.isLoading}
                    onChange={handleAddressValidation}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={pasteInvoice}>
                      Paste
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <Text mt="2" color="red" fontSize="sm">
                  {error}
                </Text>
                <Button
                  colorScheme="orange"
                  mt="4"
                  size="md"
                  disabled={
                    payInvoice.isLoading ||
                    invoiceInput === "" ||
                    error.length > 1
                  }
                  isLoading={payInvoice.isLoading}
                  onClick={handleValidation}
                >
                  Submit
                </Button>
              </Box>
            </AlertDialogBody>
          )}
          {step === 2 && (
            <AlertDialogBody>
              <Box mb={"4"}>
                <Flex flexDir={"column"} mb="4">
                  <Text fontWeight={"medium"}>Description</Text>
                  <Text fontSize={"sm"} color={"gray"}>
                    Sats for {invoiceInput.split("@")[0]}
                  </Text>
                </Flex>
                <InputGroup flexDir={"column"} size="md">
                  <Flex
                    align={"center"}
                    justifyContent={"space-between"}
                    mb="2"
                  >
                    <Text fontWeight={"medium"}>Amount</Text>
                    <Text fontSize={"sm"} color={"gray"}>
                      between {(lightningData?.minSendable || 0) / 1000} and{" "}
                      {(lightningData?.maxSendable || 0) / 1000} sats
                    </Text>
                  </Flex>
                  <Input
                    width={"100%"}
                    pr="4.5rem"
                    type="text"
                    placeholder="Enter amount to send"
                    value={amountToSend}
                    onChange={handleWithdrawAmount}
                  />
                  <InputRightElement width="4.5rem"></InputRightElement>
                </InputGroup>
                <Text mt="2" color="red" fontSize="sm">
                  {error}
                </Text>
                <Flex gap={"2"}>
                  <Button
                    colorScheme="gray"
                    mt="4"
                    size="md"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="orange"
                    mt="4"
                    size="md"
                    disabled={
                      payInvoice.isLoading ||
                      invoiceInput === "" ||
                      error.length > 1
                    }
                    isLoading={payInvoice.isLoading || withdrawSats.isLoading}
                    onClick={handleWithdrawalValidation}
                  >
                    Send
                  </Button>
                </Flex>
              </Box>
            </AlertDialogBody>
          )}
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default WalletAlert;
