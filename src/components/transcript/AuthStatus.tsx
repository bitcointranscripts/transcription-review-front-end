import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";

const AuthStatus = ({ title, message }: { title: string; message: string }) => {
  return (
    <>
      <Heading size="xl" textAlign="center">
        {title}
      </Heading>
      <Box w="full" mx="auto" maxW="600px">
        <Text textAlign="center">{message}</Text>
      </Box>
    </>
  );
};

export default AuthStatus;
