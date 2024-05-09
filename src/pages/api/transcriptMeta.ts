import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

import config from "@/config/config.json";
import { SelectableMetadataType } from "../../../types";

// Generic function to transform an array of strings to SelectableMetadataType
function transformToSelectableMetadata(
  arr: string[]
): SelectableMetadataType[] {
  return arr.map((item) => ({
    slug: item,
    value: item,
  }));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await axios.get(
      `${config.btctranscripts_base_url}status.json`
    );

    if (response.status !== 200) {
      throw Error(`HTTP error! Status: ${response.status}`);
    }
    const data = response.data.existing;

    // Use the generic function to transform arrays
    const categories = transformToSelectableMetadata(data.categories);
    const speakers = transformToSelectableMetadata(data.speakers);
    const tags = transformToSelectableMetadata(data.tags);

    res.status(200).json({ categories, speakers, tags });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred while fetching metadata" });
  }
}
