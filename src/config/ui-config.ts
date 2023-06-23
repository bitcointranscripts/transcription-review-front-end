/* eslint-disable import/no-anonymous-default-export */

// FULL_WIDTH_ROUTES are routes with no width restriction on their containers

const ROUTES_CONFIG = {
  HOME: "",
  TUTORIAL: "tutorial",
};
export default {
  FULL_WIDTH_ROUTES: [ROUTES_CONFIG["HOME"], ROUTES_CONFIG["TUTORIAL"]],
  YOUTUBE_TIMESTAMP_IN_SECONDS: {
    1: 136,
    2: 152,
    3: 302,
  },
};
