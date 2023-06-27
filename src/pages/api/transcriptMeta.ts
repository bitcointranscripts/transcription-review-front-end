import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import * as cheerio from "cheerio";
import config from "@/config/config.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getMetaFromResults = (data: any) => {
    let _array: string[] = [];
    const $ = cheerio.load(data);
    const ulResults = $(".container-fluid .main ul");
    const categoriesLink = ulResults.find("li a");
    categoriesLink.each((_index, element) => {
      const formattedText = $(element).text().replaceAll("/", "").toLowerCase();
      _array.push(formattedText);
    });
    return _array;
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
    const [categories, tags] = await Promise.all([
      makeRequest(config.btctranscripts_categories_url),
      makeRequest(config.btctranscripts_tags_url),
    ]);
    res.status(200).json({ categories, tags });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred while fetching metaData" });
  }
}
