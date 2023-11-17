import { useRouter } from "next/router";
import { UI_CONFIG } from "@/config/ui-config";

const useNoContainerLimit = () => {
  const router = useRouter();
  const path = router.pathname?.split("/")[1] ?? "";
  const noRestriction = UI_CONFIG.FULL_WIDTH_ROUTES.includes(path);
  const homeRestriction = UI_CONFIG.FULL_NAV_ROUTES.includes(path);
  return { noRestriction, homeRestriction };
};

export default useNoContainerLimit;
