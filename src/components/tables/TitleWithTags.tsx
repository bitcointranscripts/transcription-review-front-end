import { Box, Flex, Td, Text } from "@chakra-ui/react";
import Link from "next/link";

import {
  convertStringToArray,
  tagColors,
  transcriptsCategories,
} from "@/utils";
import config from "@/config/config.json";
import { resolveGHApiUrl } from "@/utils/github";

const resolveTranscriptUrl = (transcriptUrl: string | null) => {
  if (transcriptUrl) {
    const { filePath, srcDirPath } = resolveGHApiUrl(transcriptUrl);
    // btctranscripts.com url for this transcript
    return {
      url: `${config.btctranscripts_base_url}${filePath.slice(0, -3)}`,
      loc: srcDirPath,
    };
  }
  return null;
};

type TitleWithTagsProps = {
  title: string;
  id: number;
  categories: string | string[];
  loc?: string;
  transcriptUrl?: string | null;
  allTags: string[];
  length: number;
  shouldSlice?: boolean;
};
const TitleWithTags = ({
  title,
  allTags,
  categories,
  loc,
  transcriptUrl = null,
  id,
  length,
  shouldSlice = true,
}: TitleWithTagsProps) => {
  let stringCategories = Array.isArray(categories)
    ? categories[0]
    : convertStringToArray(categories)[0];
  stringCategories = stringCategories || "";
  const foundCategories = transcriptsCategories.find(
    (trs) => trs.slug.toLowerCase() === stringCategories.toLocaleLowerCase()
  );
  const tags = shouldSlice ? allTags.slice(0, 1) : allTags;
  const transcript = resolveTranscriptUrl(transcriptUrl);
  return (
    <Td width="40%">
      <Flex gap={2} flexDir="column">
        <Box>
          {!transcript && <Text>{title}</Text>}
          {transcript && (
            <Link target="_blank" rel="noopener" href={transcript.url}>
              <Text>{title}</Text>
            </Link>
          )}
          <Text fontSize={["0.7rem"]} color="gray.500">
            {transcript ? transcript.loc : loc}
          </Text>
        </Box>
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
                textTransform={"lowercase"}
                color={tagColors[categories.length % 4]}
              >
                {foundCategories?.name}
              </Text>
            </Box>
          )}
          {tags
            .filter((tag) => tag.toLowerCase() !== "none")
            .map((tag, index) => (
              <Box
                borderRadius={"8px"}
                padding={"4px"}
                paddingInline={"10px"}
                border={`2px solid ${tagColors[(id + index) % 4]}`}
                bgColor={"transparent"}
                key={tag}
              >
                <Text
                  fontSize={"11.323px"}
                  lineHeight={"normal"}
                  textTransform={"lowercase"}
                  color={tagColors[(id + index) % 4]}
                  key={tag}
                >
                  {tag}
                </Text>
              </Box>
            ))}
          {length > 2 && shouldSlice && <Text>+{length - 2}</Text>}
        </Flex>
      </Flex>
    </Td>
  );
};

export default TitleWithTags;
