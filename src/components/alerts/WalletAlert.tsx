import { usePayInvoice, useValidateAddress } from "@/services/api/wallet";
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
import { useSession } from "next-auth/react";
import { ChangeEvent, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  refetch: () => void;
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

const WalletAlert = ({ isOpen, onCancel, refetch }: Props) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  const { data: sessionData } = useSession();
  const sessionDataId = sessionData?.user?.id;
  const toast = useToast();
  const [invoiceInput, setInvoiceInput] = useState("");
  const [step, setStep] = useState(1);
  const [lightningData, setLightningData] = useState<
    LightningResponse | undefined
  >();
  const [error, setError] = useState("");

  const payInvoice = usePayInvoice();
  const validateAddress = useValidateAddress();
  const handleClose = () => {
    setInvoiceInput("");
    onCancel();
  };
  const handleAddressValidation = (e: ChangeEvent<HTMLInputElement>) => {
    const lnAddress = e.target.value;
    if (lnAddress.match(/^[a-z0-9\-_.]+@[a-z0-9\-_.]+/)) {
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
    if (!invoiceInput.match(/^[a-z0-9\-_.]+@[a-z0-9\-_.]+/)) {
      setError("not a valid lightening address");
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
                    placeholder="Enter a lightning address"
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
                  />
                  <InputRightElement width="4.5rem"></InputRightElement>
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
                  Send
                </Button>
              </Box>
            </AlertDialogBody>
          )}
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default WalletAlert;
