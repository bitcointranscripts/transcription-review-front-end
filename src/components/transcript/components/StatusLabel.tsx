import {
  MdOutlineAccessTimeFilled,
  MdCheckCircleOutline,
} from "react-icons/md";
import { Box } from "@chakra-ui/react";

import { getTimeLeftText } from "@/utils";
import { Review } from "../../../../types";

type Props = Pick<Review, "createdAt" | "submittedAt">;

const formatTimeDifference = (date: Date) => {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `Submitted ${diffMinutes} minutes ago`;
  } else if (diffHours >= 24) {
    const diffDays = Math.floor(diffHours / 24);
    return `Submitted ${diffDays} days ago`;
  } else {
    return `Submitted ${Math.floor(diffHours)} hours ago`;
  }
};

const StatusLabel = ({ createdAt, submittedAt }: Props) => {
  const textColor = submittedAt ? "green.700" : "red.700";

  return (
    <Box
      display="flex"
      gap={2}
      fontSize="16px"
      fontWeight={700}
      lineHeight={1}
      color={textColor}
      ml="auto"
    >
      {submittedAt ? (
        <>
          <span>
            <MdCheckCircleOutline />
          </span>
          <span>{formatTimeDifference(new Date(submittedAt))}</span>
        </>
      ) : (
        <>
          <span>
            <MdOutlineAccessTimeFilled />
          </span>
          <span>{getTimeLeftText(createdAt)}</span>
        </>
      )}
    </Box>
  );
};

export default StatusLabel;
