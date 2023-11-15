import { useMediaQuery } from "@chakra-ui/react";
import { useState } from "react";

const useMobileWarning = () => {
  const [showWarning, setShowWarning] = useState(false);
  const isMobileView = useMediaQuery("(max-width: 480px)");
  const isMobileAction = () => {
    if (isMobileView) {
      setShowWarning(true);
      return true;
    } else return false;
  };

  const closeWarning = () => setShowWarning(false);

  return {
    showWarning,
    closeWarning,
    isMobileAction,
  };
};

export default useMobileWarning;
