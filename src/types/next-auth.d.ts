/* eslint-disable no-unused-vars */
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

/** Example on how to extend the built-in session types */
declare module "next-auth" {
  interface Session {
    /** This is an example. You can find me in types/next-auth.d.ts */
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: number;
      permissions?: string;
      githubUsername?: string;
      jwt: string;
    };
    expires: ISODateString;
    accessToken?: string;
  }

  interface GhExtendedProfile extends Profile {
    login: string;
    avatar_url: string;
    email: string;
    [key]?: string;
  }
}

/** Example on how to extend the built-in types for JWT */
declare module "next-auth/jwt" {
  interface JWT {
    /** This is an example. You can find me in types/next-auth.d.ts */
    id?: number;
  }
}
