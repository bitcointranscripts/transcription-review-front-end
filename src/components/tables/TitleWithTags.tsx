import {
  convertStringToArray,
  tagColors,
  transcriptsCategories,
} from "@/utils";
import { Box, Flex, Td, Text } from "@chakra-ui/react";
import React from "react";

type TitleWithTagsProps = {
  title: string;
  id: number;
  categories: string | string[];
  allTags: string[];
  length: number;
};
const TitleWithTags = ({
  title,
  allTags,
  categories,
  id,
  length,
}: TitleWithTagsProps) => {
  let stringCategories = Array.isArray(categories)
    ? categories[0]
    : convertStringToArray(categories)[0];
  stringCategories = stringCategories || "";
  const foundCategories = transcriptsCategories.find(
    (trs) => trs.slug.toLowerCase() === stringCategories.toLocaleLowerCase()
  );
  return (
    <Td width="40%">
      <Flex gap={2} flexDir="column">
        <Text>{title}</Text>
        <Flex wrap="wrap" gap={2} alignItems="center">
          {foundCategories && (
            <Box
              borderRadius={"8px"}
              padding={"4px"}
              whiteSpace="nowrap"
              paddingInline={"10px"}
              border={`2px solid ${tagColors[categories.length % 4]}`}
              bgColor={"transparent"}
            >
              <Text
                fontSize={"11.323px"}
                lineHeight={"normal"}
                fontWeight={600}
                textTransform={"capitalize"}
                color={tagColors[categories.length % 4]}
              >
                {foundCategories?.name}
              </Text>
            </Box>
          )}
          {allTags
            .slice(0, 2)
            .filter((tags) => tags.toLowerCase() !== "none")
            .map((tags, index) => (
              <Box
                borderRadius={"8px"}
                padding={"4px"}
                paddingInline={"10px"}
                border={`2px solid ${tagColors[(id + index) % 4]}`}
                bgColor={"transparent"}
                key={tags}
              >
                <Text
                  fontSize={"11.323px"}
                  lineHeight={"normal"}
                  textTransform="capitalize"
                  color={tagColors[(id + index) % 4]}
                  key={tags}
                >
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
