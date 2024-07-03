import { Box, Divider, Flex, Heading, Icon } from "@chakra-ui/react";
import React from "react";
import { BiLockOpenAlt } from "react-icons/bi";

const AdminMenu = ({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: string;
}) => {
  return (
    <>
      <Box my={4}>
        <Divider />
        <Flex my={4} gap={2} alignItems="center">
          <Heading size="sm" color="gray.400" textTransform={"capitalize"}>
            {role}
          </Heading>
          <Icon color={"orange.400"} as={BiLockOpenAlt} />
        </Flex>
        {children}
      </Box>
    </>
  );
};

export default AdminMenu;
