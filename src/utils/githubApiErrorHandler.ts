import { NextApiRequest, NextApiResponse } from "next";

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export function withGithubErrorHandler(
  handler: ApiHandler,
  customErrorMessage?: string
): ApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error: any) {
      if (error instanceof UnauthorizedError) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      console.error(error);
      res.status(500).json({
        message:
          error?.message ??
          customErrorMessage ??
          "An unexpected error occurred",
      });
    }
  };
}
