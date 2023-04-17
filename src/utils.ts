import { format, hoursToMilliseconds, millisecondsToHours } from "date-fns";
import { NextApiRequest } from "next";
import { MetadataProps } from "../types";
import config from "./config/config.json";

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
    day: _date[0],
    month: _date[1],
    year: _date[2],
  };
  if (stringFormat) {
    return `${year}-${month}-${day}`;
  }
  return { day, month, year };
};
// export const dateFormatGeneral = (date: Date | null, stringFormat: boolean) => {
//   if (!date) return null;
//   const _date = new Date(date);
//   const { day, month, year } = {
//     day: _date.getUTCDate(),
//     month: _date.getUTCMonth() + 1,
//     year: _date.getUTCFullYear(),
//   };
//   if (stringFormat) {
//     return `${year}-${month}-${day}`;
//   }
//   return { day, month, year };
// };

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
  const timeLeft = millisecondsToHours(givenDate - now);
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
  return `${hours} hours left`;
};

const wordsFormat = new Intl.NumberFormat("en-US", {
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
    this.metaData = `---\n` +
                    `title: ${fileTitle}\n` +
                    `transcript_by: ${transcript_by} \n`;

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
      // .map((item) => item.trim());
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
