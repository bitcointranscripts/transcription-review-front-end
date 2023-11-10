import YoutubeComponent from "@/components/home/YoutubeComponent";
import YoutubePortal from "@/components/home/YoutubePortal";
import { Flex, Image } from "@chakra-ui/react";
import { useState } from "react";
import { YouTubePlayer } from "react-youtube";

export type YoutubeModalInfo = {
  visible: boolean;
  accordionStep: null | number;
};

const YoutubeTutorial = () => {
  const [modalPlayer, setModalPlayer] = useState<YouTubePlayer>(null);
  const [modalInfo, setModalInfo] = useState<YoutubeModalInfo>({
    visible: false,
    accordionStep: null,
  });

  const handleClose = () => {
    modalPlayer.pauseVideo();
    setModalInfo((prev) => ({ ...prev, visible: false }));
  };
  const handleOpen = () => {
    if (modalPlayer) {
      modalPlayer.playVideo();
    }
    setModalInfo((prev) => ({ ...prev, visible: true }));
  };

  return (
    <>
      {!modalInfo.visible && (
        <Flex
          maxW={"100%"}
          justifyContent={"end"}
          alignItems={"start"}
          w={"100%"}
          position={"relative"}
          onClick={handleOpen}
        >
          <Image
            display={{ lg: "none" }}
            aspectRatio={"16:9"}
            zIndex={40}
            src={"home/hero-mobile.png"}
            style={{
              objectFit: "contain",
              right: "0px",
            }}
            alt="BTC Youtube"
          />
          <Image
            display={{ base: "none", lg: "block" }}
            aspectRatio={"16:9"}
            className="thumbnail"
            src={"home/hero-thumbnail.png"}
            style={{
              objectFit: "contain",
              borderRadius: "30px 0px 0px 30px",
              right: "0px",
            }}
            alt="BTC Youtube"
          />
        </Flex>
      )}

      <YoutubePortal modalInfo={modalInfo} handleClose={handleClose}>
        <YoutubeComponent player={modalPlayer} setPlayer={setModalPlayer} />
      </YoutubePortal>
    </>
  );
};

export default YoutubeTutorial;
