import React, { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

const HomeMediaPortal = ({
  root,
  children,
}: {
  root: HTMLElement | null;
  children: React.ReactNode;
}) => {
  const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(
    null
  );
  const mediaViewerElement = document.createElement("div");
  mediaViewerElement.className = "media-viewer";

  useLayoutEffect(() => {
    const _wrapperElement = root!.appendChild(mediaViewerElement);
    setWrapperElement(_wrapperElement);
    return () => {
      root!.removeChild(_wrapperElement);
    };
  }, []);

  if (wrapperElement === null) return null;
  return createPortal(children, wrapperElement);
};

export default HomeMediaPortal;
