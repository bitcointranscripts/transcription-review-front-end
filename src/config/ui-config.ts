// FULL_WIDTH_ROUTES are routes with no width restriction on their containers

export const ROUTES_CONFIG = {
  HOME: "",
  HOME_DUP: "home",
  TUTORIAL: "home#tutorial",
  TRANSCRIPTS: "transcripts",
  WALLET: "wallet",
  TRANSACTIONS: "admin/transactions",
  ALL_REVIEWS: "admin/reviews?status=active",
  REVIEWS: "reviews",
  USERS: "admin/users",
  TRANSCRIPTION: "admin/transcription",
};

export const UI_CONFIG = {
  FULL_WIDTH_ROUTES: [
    ROUTES_CONFIG["HOME"],
    ROUTES_CONFIG["TUTORIAL"],
    ROUTES_CONFIG["HOME_DUP"],
  ],
  FULL_NAV_ROUTES: [ROUTES_CONFIG["HOME"]],
  YOUTUBE_TIMESTAMP_IN_SECONDS: {
    1: 136,
    2: 152,
    3: 302,
  },
  MAX_AUTOCOMPLETE_LENGTH_TO_FILTER: 1000,
  DEBOUNCE_DELAY: 1000,
};
