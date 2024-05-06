import { format, hoursToMilliseconds, millisecondsToHours } from "date-fns";
import yaml from "js-yaml";
import { NextApiRequest } from "next";
import slugify from "slugify";
import { MetadataProps } from "../../types";
import ClockIcon from "../components/svgs/ClockIcon";
import GithubIcon from "../components/svgs/GithubIcon";
import LaptopIcon from "../components/svgs/LaptopIcon";
import config from "../config/config.json";

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

  constructor({ fileTitle, transcript_by, url, ...restProps }: MetadataProps) {
    this.fileTitle = fileTitle;
    this.source = url;

    const jsonData = {
      title: fileTitle,
      transcript_by: `${transcript_by} via ${config.app_tag}`,
      media: url,
      ...restProps,
    };

    this.metaData =
      `---\n` +
      yaml.dump(jsonData, {
        forceQuotes: true,
      }) +
      "---\n";
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
  if (Array.isArray(data) && data.length > 0) {
    return JSON.stringify(data);
  }

  if (typeof data === "string" && !!data.trim()) {
    return data.trim();
  }

  return undefined;
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
    sub: "*You won’t be \n able to do this on \n a mobile phone",
  },
  {
    Icon: GithubIcon,
    heading: "A GitHub \naccount",
    sub: "*Don’t have one?\n Here’s how to ",
    linkText: "create an account",
    link: "https://docs.github.com/en/get-started/signing-up-for-github/signing-up-for-a-new-github-account",
  },
  {
    Icon: ClockIcon,
    heading: "A few hours of \nyour day ",
    sub: "*Submit the\n transcript within 24 \nhours of claiming it",
  },
];

export const whyConsiderEdit = [
  {
    src: "/home/pow.png",
    heading: " Build POW",
    sub: "Build proof of work by\n contributing to bitcoin (we’ll add\n your GitHub name as a contributor)",
  },
  {
    src: "/home/bitcoin.png",
    heading: "Deep dive into Bitcoin",
    sub: "Improve your comprehension of\n bitcoin and lightning",
  },
  {
    src: "/home/support.png",
    heading: "Support the community",
    sub: "Make it easier to discover,\n search for, and use information\n about technical bitcoin concepts",
  },
];

// GUIDELINES REVIEW DATA
export const guidelinesReviewArray = [
  {
    heading: "Transcription Accuracy",
    paragraphs: [
      "**Correct AI transcription mistakes**: Look out for and fix errors made by the AI, particularly with technical terms and Bitcoin-related language. The AI might not fully understand certain audio parts or might not know specific jargon, leading to mistakes.",
      "**Use backticks for technical terms and equations**: When you encounter code-related technical terms or math equations, make sure to put them \\`inside backticks\\` to highlight them.",
    ],
  },
  {
    heading: "Transcription Style",
    paragraphs: [
      "**Use clean verbatim transcription style**: Capture the recorded content precisely, removing all unnecessary distractions to improve clarity.",
      "**Remove distractions and avoid paraphrasing**: Focus on the speaker's exact words by removing distractions such as false starts, filler words, stammers, self-corrections, and non-verbal interruptions. Simultaneously, avoid paraphrasing to preserve the original speech's integrity and readability.",
    ],
  },
  {
    heading: "Transcript Structure",
    paragraphs: [
      'Maintain the original "one-sentence-per-line" formatting and timestamps.',
      "Ensure coherent paragraphing around chapter titles and speaker timestamps.",
      "Break text into paragraphs and ensure accurate punctuation for better readability.",
    ],
  },
  {
    heading: "Chapters",
    paragraphs: [
      "Break the transcript into manageable segments using your familiarity with the material.",
      "Utilize source materials (slides, video description, content) to derive and integrate chapters.",
      "Start chapters with H2 formatting, title is automatically rendered as H1.",
    ],
  },
  {
    heading: "Speaker Attribution",
    paragraphs: [
      "Accurately attribute speakers, preventing potential mix-ups or merging of dialogue caused by AI transcription errors.",
      'Use square brackets for infrequent speaker contributions (e.g. [Audience]: "Hello world").',
    ],
  },
  {
    heading: "Final Review",
    paragraphs: [
      "Upon completion, read through the entire transcript for coherence and readability.",
      "Leverage your familiarity with the material to identify appropriate tags and chapters.",
    ],
  },
];

export const discordInvites = {
  review_guidelines: "https://discord.gg/jqj4maCs8p",
  feedback: "https://discord.gg/W4cmWRhMnr",
};

export function parseJsonArray<T>(possibleArray: unknown): {
  ok: boolean;
  data: T | null;
} {
  try {
    const data = JSON.parse(possibleArray as string);
    return { ok: Array.isArray(data), data };
  } catch (e) {
    return { ok: false, data: null };
  }
}
