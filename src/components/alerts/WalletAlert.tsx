import { usePayInvoice } from "@/services/api/wallet";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  refetch: () => void;
};

const WalletAlert = ({ isOpen, onCancel, refetch }: Props) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    onCancel();
  };

  const { data: sessionData } = useSession();
  const sessionDataId = sessionData?.user?.id;
  const toast = useToast();
  const [invoiceInput, setInvoiceInput] = useState("");

  const payInvoice = usePayInvoice();

  const pasteInvoice = () => {
    navigator.clipboard.readText().then((text) => {
      setInvoiceInput(text);
    });
  };

  const handlePayment = async () => {
    if (invoiceInput === "") {
      return;
    }
    payInvoice.mutate(
      {
        invoice: invoiceInput,
        userId: sessionDataId,
      },
      {
        onSuccess: (response) => {
          if (
            response?.response?.status >= 400 ||
            response?.response?.status <= 500
          ) {
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
          refetch();
          toast({
            title: "Paid",
            description: "We've paid your invoice. Keep reviewing!",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
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
          <AlertDialogBody>
            <Box mb={"4"}>
              <InputGroup size="md">
                <Input
                  width={"500px"}
                  pr="4.5rem"
                  type="text"
                  placeholder="Enter a lightning invoice"
                  value={invoiceInput}
                  disabled={payInvoice.isLoading}
                  onChange={(e) => setInvoiceInput(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={pasteInvoice}>
                    Paste
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Button
                colorScheme="orange"
                mt="4"
                size="md"
                disabled={payInvoice.isLoading || invoiceInput === ""}
                isLoading={payInvoice.isLoading}
                onClick={handlePayment}
              >
                Submit
              </Button>
            </Box>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default WalletAlert;
