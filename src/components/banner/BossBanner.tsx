import { Banner } from "@bitcoin-dev-project/bdp-ui";
import { Box } from "@chakra-ui/react";

const BossBanner = ({ top }: { top: number }) => {
  return (
    <Box
      className={`bg-bdp-background`}
      zIndex={100}
      position={"fixed"}
      top={top}
      background={"white"}
      width={"full"}
    >
      <Banner
        headingText="Start your career in bitcoin open source —"
        linkText="APPLY TODAY"
        linkTo="https://learning.chaincode.com/#BOSS"
        hasBoss
      />
    </Box>
  );
};

export default BossBanner;
