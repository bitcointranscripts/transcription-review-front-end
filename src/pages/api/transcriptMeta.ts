import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import * as cheerio from "cheerio";
import config from "@/config/config.json";
import { SelectableMetaDataType } from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getMetaFromResults = (data: any) => {
    let _array: SelectableMetaDataType[] = [];
    const $ = cheerio.load(data);
    const ulResults = $(".container-fluid .main ul");
    const categoriesLink = ulResults.find("li a");
    categoriesLink.each((_index, element) => {
      const _possibleslug = $(element).attr("href")?.split("/")[2];
      const value = $(element).text();
      const slug = _possibleslug ?? value.replaceAll(" ", "").toLowerCase();
      _array.push({ slug, value });
    });

    return _array.sort((a, b) =>
      a.value.toLowerCase().localeCompare(b.value.toLowerCase())
    );
  };

  const makeRequest = async (url: string) => {
    try {
      const response = await axios.get(url);
      const finalArray = getMetaFromResults(response.data);
      return finalArray;
    } catch (error) {
      throw error; // Re-throw the error to reject the Promise
    }
  };
  try {
    const [categories, speakers, tags] = await Promise.all([
      makeRequest(config.btctranscripts_categories_url),
      makeRequest(config.btctranscripts_speakers_url),
      makeRequest(config.btctranscripts_tags_url),
    ]);
    res.status(200).json({ categories, speakers, tags });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred while fetching metaData" });
  }
}
