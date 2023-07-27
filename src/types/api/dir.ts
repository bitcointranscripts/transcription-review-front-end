export type DirectoryRes = {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: null;
  type: string;
  _links: Links;
};

export type Links = {
  self: string;
  git: string;
  html: string;
};
