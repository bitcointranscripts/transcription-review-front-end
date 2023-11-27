import { format, hoursToMilliseconds, millisecondsToHours } from "date-fns";
import { NextApiRequest } from "next";
import slugify from "slugify";
import { MetadataProps, UserReviewData } from "../../types";
import config from "../config/config.json";
import ClockIcon from "../components/svgs/ClockIcon";
import LaptopIcon from "../components/svgs/LaptopIcon";
import GithubIcon from "../components/svgs/GithubIcon";

const claim_duration_in_ms = hoursToMilliseconds(
  config.claim_duration_in_hours
);

export const dateFormat = (date: Date) => {
  const _date = new Date(date);
  return format(_date, "yyyy/MM/dd");
};

export const dateFormatGeneral = (date: Date | null, stringFormat: boolean) => {
  if (!date) return null;
  const _date = dateFormat(date).split("/");
  const { day, month, year } = {
    day: _date[2],
    month: _date[1],
    year: _date[0],
  };
  if (stringFormat) {
    return `${year}-${month}-${day}`;
  }
  return { day, month, year };
};

export const getTimeLeft = (date: Date | null): number | null => {
  if (!date) {
    return null;
  }
  const now = new Date().getTime();
  const givenDate = new Date(date).getTime();
  const expiryDate = givenDate + claim_duration_in_ms;
  if (expiryDate < now) {
    return null;
  }
  const timeLeft = millisecondsToHours(expiryDate - now);
  return timeLeft;
};

export const getTimeLeftText = (date: Date | null) => {
  if (!date) {
    return "no timestamp found";
  }
  const hours = getTimeLeft(date);
  if (!hours) {
    return "expired";
  }
  return `${hours} hours to review and submit`;
};

export const wordsFormat = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
});

export const getCount = (item: number | string) => {
  const formattedItem = typeof item === "string" ? item.length : item;
  return wordsFormat.format(formattedItem);
};

export class Metadata {
  private metaData: string;
  public fileTitle: string;
  public source: string;

  constructor({
    fileTitle,
    transcript_by,
    url,
    date,
    tags,
    speakers,
    categories,
  }: MetadataProps) {
    this.fileTitle = fileTitle;
    this.source = url;

    // eslint-disable-next-line prettier/prettier
    this.metaData =
      `---\n` +
      `title: "${fileTitle}"\n` +
      `transcript_by: ${transcript_by} via ${config.app_tag}\n`;

    this.metaData += `media: ${url}\n`;

    if (tags) {
      this.metaData += `tags: ${tags}\n`;
    }

    if (speakers) {
      this.metaData += `speakers: ${speakers}\n`;
    }

    if (categories) {
      this.metaData += `categories: ${categories}\n`;
    }
    this.metaData += `date: ${date}\n`;

    this.metaData += `---\n`;
  }

  public toString(): string {
    return this.metaData;
  }
}

export async function retryApiCall<T>(
  apiCallFunc: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await apiCallFunc();
      return response;
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error(`API call failed after ${retries} attempts`);
}

export function getRequestUrl(req: NextApiRequest) {
  const host = req.headers.host || "localhost:3000";
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const localUrl = `${protocol}://${host}`;
  const requestUrl = process.env.VERCEL_URL ?? localUrl;
  return requestUrl;
}

export function formatDataForMetadata(data: string[] | string) {
  if (Array.isArray(data)) {
    if (data.length) {
      return JSON.stringify(data);
    } else {
      return undefined;
    }
  } else if (data.trim()) {
    return data;
  } else {
    return undefined;
  }
}

export function reconcileArray(possibleArray: unknown): string[] {
  if (Array.isArray(possibleArray)) return possibleArray;
  if (possibleArray === "None") return [];
  if (typeof possibleArray === "string") {
    if (
      possibleArray[0] === "[" &&
      possibleArray[possibleArray.length - 1] === "]"
    ) {
      const newArray = possibleArray
        .substring(1, possibleArray.length - 1)
        .replace(/['"]+/g, "")
        .split(", ");
      return newArray;
    } else if (possibleArray.includes(",")) {
      const newArray = possibleArray
        .replace(/['"]+/g, "")
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
      return newArray;
    } else {
      return [];
    }
  }
  return [];
}

export function newIndexFile(directoryName: string) {
  const title = directoryName
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
  let file = "";
  // eslint-disable-next-line prettier/prettier
  file += `---\n` + `title: ${title}\n` + `---\n\n` + `{{< childpages >}}`;
  return file;
}

export function deriveFileSlug(title: string, regex?: RegExp) {
  const _trimmedFileName = title.trim();
  const fileSlug = slugify(_trimmedFileName, {
    strict: false,
    lower: true,
    remove: regex,
  });
  return fileSlug;
}

export function derivePublishUrl(
  fileName: string,
  loc: string = config.defaultDirectoryPath
) {
  const base_url = config.btctranscripts_base_url;
  const publishUrl = base_url + loc + "/" + fileName;
  return publishUrl;
}

export function calculateReadingTime(wordCount: number, wpm = 150) {
  const minutes = wordCount / wpm;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.ceil(minutes % 60);

  if (hours > 0) {
    return `${hours} hr`;
  } else {
    return `${remainingMinutes} mins`;
  }
}

export function isReviewActive(review: UserReviewData) {
  const currentTime = new Date().getTime();
  const timeStringAt24HoursPrior = new Date(
    currentTime - claim_duration_in_ms
  ).toISOString();

  return (
    String(review.createdAt) >= timeStringAt24HoursPrior &&
    review.mergedAt === null &&
    review.archivedAt === null &&
    review.submittedAt === null
  );
}

export function isReviewPending(review: UserReviewData) {
  return (
    review.submittedAt !== null &&
    review.mergedAt === null &&
    review.archivedAt === null
  );
}

// Convert a string to an array
export const convertStringToArray = (text: string[] | string) => {
  let stringArray = text as string;
  if (stringArray && stringArray[0] === "[") {
    const parsed = stringArray
      .substring(1, text.length - 1)
      .replaceAll("'", "")
      .split(", ")
      .filter((data) => data.length > 1);
    return parsed;
  }
  return Array.isArray(stringArray)
    ? (stringArray as string[])
    : [stringArray || "None"];
};

//  data for tag colors
export const tagColors = ["#9C007A", "#16863C", "#9C3800", "#00519C"];

export const transcriptsCategories = [
  {
    name: "🎙️ Conference",
    slug: "conference",
  },
  { name: "💻 Core-Dev-Tech", slug: "core-dev-tech" },
  { name: "💻 Hackathon", slug: "hackathon" },
  { name: "🤝 Meeting", slug: "meeting" },
  { name: "✅ Meetup", slug: "meetup" },
  { name: "🎤 Podcast", slug: "podcast" },
  { name: "🏘️ Residency", slug: "residency" },
  { name: "📹 Video", slug: "video" },
  { name: "💼 Workshop", slug: "workshop" },
];

export const displaySatCoinImage = (wordCount: number) => {
  if (wordCount < 2500) return "/sats-coins/low.svg";
  if (wordCount < 5000) return "/sats-coins/medium.svg";
  if (wordCount < 7500) return "/sats-coins/high.svg";
  if (wordCount > 7500) return "/sats-coins/very-high.svg";
  else return "";
};

export const extractPullNumber = (githubUrl: string) => {
  const pattern = /\/pull\/(\d+)/;
  const match = githubUrl.match(pattern);
  if (match) {
    return match[1];
  } else {
    return null;
  }
};
export const isNullOrUndefined = (value: any) => {
  return value === null || typeof value === "undefined";
};

// Landing Page dummies

export const thingsYouNeed = [
  {
    Icon: LaptopIcon,
    heading: "A computer ",
    sub: "*You won’t be able \n to do this on a mobile phone",
  },
  {
    Icon: GithubIcon,
    heading: "A GitHub account",
    sub: "*Don’t have one? Here’s how to ",
    linkText: "create an account",
    link: "https://docs.github.com/en/get-started/signing-up-for-github/signing-up-for-a-new-github-account",
  },
  {
    Icon: ClockIcon,
    heading: "A few hours of your day ",
    sub: "*Submit the transcript within 24 hours of claiming it",
  },
];

export const whyConsiderEdit = [
  {
    src: "/home/pow.png",
    heading: " Build POW",
    sub: "Build proof of work by contributing to bitcoin (we’ll add your GitHub name as a contributor)",
  },
  {
    src: "/home/bitcoin.png",
    heading: "Deep dive into Bitcoin",
    sub: "Improve your comprehension of bitcoin and lightning",
  },
  {
    src: "/home/support.png",
    heading: "Support the community",
    sub: "Make it easier to discover, search for, and use information about technical bitcoin concepts",
  },
];
