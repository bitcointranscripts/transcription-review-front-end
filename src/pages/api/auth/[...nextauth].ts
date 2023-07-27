import jwtDecode from "jwt-decode";
import { signInUser, updateUserProfile } from "@/services/api/lib";
import NextAuth, {
  GhExtendedProfile,
  NextAuthOptions,
  Session,
} from "next-auth";
// import { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";
import { DecodedJWT, UserSessionType } from "../../../../types";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      authorization: {
        url: "https://github.com/login/oauth/authorize",
        params: { scope: "read:user user:email public_repo" },
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session({
      session,
      token,
    }: {
      session: Session;
      token: any;
    }): Promise<Session> {
      // Send userId and permission properties to the client
      const defaultSessionUser = session.user;
      session.user = {
        ...token.user,
        ...defaultSessionUser,
      };
      session.accessToken = token.user.access_token;
      return session;
    },
    async jwt({ token, account, ...response }) {
      const profile = response.profile as GhExtendedProfile | undefined;

      // jwt callback runs very frequently, this checks if we haven't run backend auth on the user yet
      if (!token?.id && account?.access_token && profile) {
        try {
          const signedInUserToken = await signInUser({
            github_access_token: account.access_token,
          });
          const decodedJwt: DecodedJWT = jwtDecode(signedInUserToken.jwt);
          const { userId, permissions, isEmailPresent } = decodedJwt;
          const userInfo: UserSessionType = {
            id: userId,
            email: profile.email,
            permissions,
            githubUsername: profile.login,
            jwt: signedInUserToken.jwt,
          };

          if (!isEmailPresent) {
            // not awaited so update is non blocking (also there is a timeout for the parent async jwt function)
            updateUserProfile(
              {
                id: userId,
                email: profile.email,
                username: profile.login,
              },
              {
                jwt: signedInUserToken.jwt,
              }
            );
          }

          token.user = {
            ...userInfo,
            access_token: account?.access_token,
          };
        } catch (err) {
          token.id = undefined;
        }
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
export default NextAuth(authOptions);
