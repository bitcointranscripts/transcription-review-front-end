import { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { auth } from "../pages/api/auth/[...nextauth]";
import { UnauthorizedError } from "./githubApiErrorHandler";

type GetOctokitOptions = {
  allowAppFallback?: boolean;
};

export async function getOctokit(
  req: NextApiRequest,
  res: NextApiResponse,
  options: GetOctokitOptions = {}
) {
  let octokit: Octokit;
  let owner: string | undefined;

  // Try session-based authentication first
  const session = await auth(req, res);
  if (session?.accessToken) {
    octokit = new Octokit({ auth: session.accessToken });
    owner = session.user?.githubUsername;
  }

  // Fall back to GitHub App if no session
  else {
    // If no session and app fallback is not allowed, send unauthorized response
    if (!options.allowAppFallback) {
      throw new UnauthorizedError("Unauthorized");
    }

    const privateKeyBase64 = process.env.GITHUB_CURATOR_PRIVATE_KEY_BASE64;

    if (!privateKeyBase64) {
      throw new Error(
        "GITHUB_CURATOR_PRIVATE_KEY environment variable is not set"
      );
    }

    // Decode the base64 private key
    const privateKey = Buffer.from(privateKeyBase64, "base64").toString("utf8");

    const appOctokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: process.env.GITHUB_CURATOR_APP_ID,
        privateKey: privateKey,
        installationId: process.env.GITHUB_CURATOR_INSTALLATION_ID,
      },
    });

    // List all installations to find the correct one
    const installations = await appOctokit.apps.listInstallations();
    const installation = installations.data.find(
      (inst) =>
        inst.id.toString() === process.env.GITHUB_CURATOR_INSTALLATION_ID
    );

    if (!installation) {
      throw new Error("Installation not found");
    }
    owner = installation.account?.login;

    const {
      data: { token },
    } = await appOctokit.apps.createInstallationAccessToken({
      installation_id: Number(process.env.GITHUB_CURATOR_INSTALLATION_ID),
    });

    octokit = new Octokit({ auth: token });
  }

  if (!owner) {
    throw new Error("Unable to determine owner");
  }

  return { octokit, owner };
}
