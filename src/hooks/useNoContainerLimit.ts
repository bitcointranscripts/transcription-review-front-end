import { useRouter } from "next/router";
import { UI_CONFIG } from "@/config/ui-config";

const useNoContainerLimit = () => {
  const router = useRouter();
  const path = router.asPath?.split("/")[1] ?? "";
  const noRestriction = UI_CONFIG.FULL_WIDTH_ROUTES.includes(path);

  return { noRestriction };
};

export default useNoContainerLimit;
