import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

const MaintenanceBanner = () => {
  return (
    <Flex
      bgColor="orange.100"
      pos={"absolute"}
      right={"0px"}
      width={"100%"}
      alignItems="center"
      zIndex={99}
    >
      <Box
        color={"gray.600"}
        flex="1 1 100%"
        fontWeight="medium"
        textAlign="center"
        padding={"16px"}
      >
        <Text
          fontSize={["16px", "20px"]}
          fontWeight={"black"}
          textTransform={"uppercase"}
          paddingBottom={"4apx"}
        >
          Service Disruption !!!
        </Text>
        <Text fontSize={["13px", "16px"]}>
          Withdrawals are currently unavailable as we are experiencing a
          downtime on our systems. <br /> We will remove this banner once
          service is restored.
        </Text>
      </Box>
    </Flex>
  );
};

export default MaintenanceBanner;
