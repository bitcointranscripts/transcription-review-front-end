import { Box } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { YoutubeModalInfo } from "./Tutorial";

const wrapperId = "home-media-viewer";

type YoutubePortalProps = {
  children: React.ReactNode;
  modalInfo: YoutubeModalInfo;
  handleClose: () => void;
};

const YoutubePortal = ({
  children,
  modalInfo,
  handleClose,
}: YoutubePortalProps) => {
  return (
    <>
      {
        <Viewer>
          <Box
            pos="fixed"
            top="0"
            left="0"
            zIndex={1}
            // display="grid"
            placeItems="center"
            w="100%"
            h="100%"
            display={modalInfo.visible ? "grid" : "none"}
            // bgColor="blackAlpha.800"
          >
            <Box
              pos="absolute"
              bgColor="blackAlpha.800"
              onClick={handleClose}
              w="100%"
              h="100%"
            ></Box>
            <Box
              pos="absolute"
              w="full"
              maxW="100%"
              maxH="100%"
              p={4}
              display="flex"
            >
              {children}
            </Box>
          </Box>
        </Viewer>
      }
    </>
  );
};

export default YoutubePortal;

// eslint-disable-next-line no-unused-vars
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
    return () => {
      if (wrapperRef.current && viewerElement.current) {
        wrapperRef.current.removeChild(viewerElement.current);
      }
    };
  }, []);

  if (viewerElement.current === null) return null;
  return createPortal(children, viewerElement.current);
};
