import { useRouter } from "next/router";

const FULL_WIDTH_ROUTES = ["home"];

const useNoContainerLimit = () => {
  const router = useRouter();
  const path = router.asPath?.split("/")[1] ?? "";
  const noRestriction = FULL_WIDTH_ROUTES.includes(path);

  return { noRestriction };
};

export default useNoContainerLimit;
