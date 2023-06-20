import { Box } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import HomeMediaPortal from "./HomeMediaPortal";

const wrapperId = "home-media-viewer";

const YoutubePortal = ({ children }: { children: React.ReactNode }) => {
  const heroYoutubeEmbed = useRef<HTMLElement | null>(null);
  useEffect(() => {
    heroYoutubeEmbed.current = document.getElementById("hero-youtube-player");
    console.log("dsd", heroYoutubeEmbed.current);
  }, []);

  if (!heroYoutubeEmbed.current) return null;

  return (
    <>
      {createPortal(children, heroYoutubeEmbed.current)}
      {/* {
        <Viewer>
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
            <Box
              pos="absolute"
              bgColor="blackAlpha.800"
              onClick={disableFullScreen}
              w="100%"
              h="100%"
            ></Box>
            <Box pos="absolute" maxW="100%" maxH="100%" p={4} display="flex">
              {children}
            </Box>
          </Box>
        </Viewer>
      } */}
    </>
  );
};

export default YoutubePortal;

const Viewer = ({ children }: { children: React.ReactNode }) => {
  const wrapperRef = useRef<HTMLElement | null>(null);
  const viewerElement = useRef<HTMLElement | null>(null);
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
    let _viewerElement = document.createElement("div");
    _viewerElement.className = "media-viewer";
    viewerElement.current = wrapperRef.current.appendChild(_viewerElement);
  }, []);

  if (viewerElement.current === null) return null;
  return createPortal(children, viewerElement.current);
};
