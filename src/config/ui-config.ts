// FULL_WIDTH_ROUTES are routes with no width restriction on their containers

export const ROUTES_CONFIG = {
  HOME: "",
  HOME_DUP: "home",
  TUTORIAL: "tutorial",
  TRANSCRIPTS: "transcripts",
  WALLET: "wallet",
  TRANSACTIONS: "transactions",
};

export const UI_CONFIG = {
  FULL_WIDTH_ROUTES: [
    ROUTES_CONFIG["HOME"],
    ROUTES_CONFIG["TUTORIAL"],
    ROUTES_CONFIG["HOME_DUP"],
  ],
  YOUTUBE_TIMESTAMP_IN_SECONDS: {
    1: 136,
    2: 152,
    3: 302,
  },
  MAX_AUTOCOMPLETE_LENGTH_TO_FILTER: 1000,
  DEBOUNCE_DELAY: 1000,
};
