import { Box } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import HomeMediaPortal from "./HomeMediaPortal";

const MediaScreen = ({
  mediaElement,
  wrapperId = "home-media-viewer",
}: {
  mediaElement: React.ReactNode;
  wrapperId?: string;
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const wrapperRef = useRef<HTMLElement | null>(null);

  const createWrapperElement = (wrapperId: string) => {
    const wrapperElement = document.createElement("div");
    wrapperElement.setAttribute("id", wrapperId);
    document.body.append(wrapperElement);
    return wrapperElement;
  };

  useEffect(() => {
    wrapperRef.current = document.getElementById(wrapperId);
    if (!wrapperRef.current) {
      wrapperRef.current = createWrapperElement(wrapperId);
    }
  }, []);

  const enableFullScreen = () => {
    setIsFullScreen(true);
  };
  const disableFullScreen = () => {
    setIsFullScreen(false);
  };

  return (
    <>
      <Box position="relative" borderRadius="lg" overflow="hidden" onClick={enableFullScreen}
        role="group"
        _hover={{filter: "drop-shadow(5px 5px 5px rgba(3, 25, 70, 0.2))"}}
      >
        {mediaElement}
        <Box
          role="group"
          display="grid"
          placeItems="center"
          position="absolute"
          top={0}
          left={0}
          width="100%"
          h="100%"
          _hover={{ bgColor: "whiteAlpha.700" }}
        >
          <Box visibility="hidden" pointerEvents="none" bgColor="orange.200" px={2} rounded="lg" color="blackAlpha.700" fontWeight={600} fontSize="14px" _groupHover={{visibility: "visible"}}>
            Click To Expand
          </Box>
        </Box>
      </Box>
      {isFullScreen && (
        <HomeMediaPortal root={wrapperRef.current}>
          <Box
            pos="fixed"
            top="0"
            left="0"
            zIndex={1}
            display="grid"
            placeItems="center"
            w="100%"
            h="100%"
            // bgColor="blackAlpha.800"
            // onClick={disableFullScreen}
          >
            <Box pos="absolute" bgColor="blackAlpha.800" onClick={disableFullScreen} w="100%" h="100%"></Box>
            <Box pos="absolute" maxW="100%" maxH="100%" p={4} display="flex">
              {mediaElement}
            </Box>
          </Box>
        </HomeMediaPortal>
      )}
    </>
  );
};

export default MediaScreen;
