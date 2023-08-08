import * as fs from "fs/promises";
import axios from "axios";

const treeUrl =
  "https://api.github.com/repos/bitcointranscripts/bitcointranscripts/git/trees/master?recursive=1";
const dirPath = "public/static/";
const fileName = "directoryMetadata.json";

const fetchGithubData = async (path: string) => {
  const { data } = await axios.get(path, {
    headers: {
      Accept: "application/vnd.github.raw+json",
    },
  });
  return data;
};

const placeContent = (
  segment: string[],
  lastEntry: any,
  currentDepth: number,
  length: number
) => {
  if (currentDepth < length) {
    if (lastEntry[segment[currentDepth]] === undefined) {
      lastEntry[segment[currentDepth]] = {};
    }
    placeContent(
      segment,
      lastEntry[segment[currentDepth]],
      currentDepth + 1,
      length
    );
  }
}

export const createDirectoryMetadata = async () => {
  const dirMetadata = {};
  try {
    const data = await fetchGithubData(treeUrl);
    const tree = data.tree;
    if (tree?.length) {
      for (const item of tree) {
        if (item.path[0] !== "." && item.type === "tree") {
          const segment = item.path.split("/");
          placeContent(segment, dirMetadata, 0, segment.length);
        }
      }
    }
    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(dirPath + fileName, JSON.stringify(dirMetadata));
    // fs.writeFileSync("public/static/directoryMetadata.json", JSON.stringify(dirMetadata));

  } catch (err) {
    console.log({ err });
  }
};
