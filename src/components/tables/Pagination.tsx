import { Button, Flex, Text } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction } from "react";

type IPagination = {
  pages: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
};
const Pagination = ({ pages, currentPage, setCurrentPage }: IPagination) => {
  return (
    <Flex justifyContent={"center"}>
      {pages > 1 &&
        Array.from({ length: pages }, (_, index) => index + 1).map((item) => (
          <Button
            colorScheme={currentPage === item ? "orange" : "gray"}
            onClick={() => setCurrentPage(item)}
            key={item}
            variant="ghost"
          >
            <Text>{item}</Text>
          </Button>
        ))}
    </Flex>
  );
};

export default Pagination;
