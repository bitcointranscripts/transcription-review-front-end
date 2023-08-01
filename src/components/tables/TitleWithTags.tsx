import { tagColors } from "@/utils";
import { Box, Flex, Td, Text } from "@chakra-ui/react";
import React from "react";

type TitleWithTagsProps = {
  title: string;
  id: number;
  allTags: string[];
  length: number;
};
const TitleWithTags = ({ title, allTags, id, length }: TitleWithTagsProps) => {
  return (
    <Td width="40%">
      <Flex gap={2} alignItems="center">
        <Text>{title}</Text>
        <Flex wrap="wrap" gap={2} alignItems="center">
          {allTags.slice(0, 2).map((tags, index) => (
            <Box
              borderRadius={"4px"}
              padding={"6px"}
              bgColor={tagColors[(id + index) % 4]}
              key={tags}
            >
              <Text textTransform="capitalize" color="#FCFCFC" key={tags}>
                {tags}
              </Text>
            </Box>
          ))}
          {length > 2 && <Text>+{length - 2}</Text>}
        </Flex>
      </Flex>
    </Td>
  );
};

export default TitleWithTags;
