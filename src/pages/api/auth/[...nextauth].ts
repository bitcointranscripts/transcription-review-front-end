import axios from "@/services/api/axios";
import {
  CreateUserProp,
  createNewUser,
  updateUserProfile,
} from "@/services/api/lib";
import NextAuth, {
  GhExtendedProfile,
  NextAuthOptions,
  Session,
} from "next-auth";
// import { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";

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
    async jwt({ isNewUser, token, account, ...response }) {
      const profile = response.profile as GhExtendedProfile | undefined;
      const createAndSetNewUser = async ({
        username,
        email,
        permissions,
      }: CreateUserProp) => {
        const res = await createNewUser({ username, email, permissions });
        if (res.data) {
          token.user = {
            ...res.data,
            access_token: account?.access_token,
          };
        } else {
          throw new Error("Unable to create user");
        }
      };

      if (isNewUser && profile?.login) {
        const { email, login } = profile;
        await createAndSetNewUser({ username: login, email });
      }
      // Temporary get userId
      // TODO: when resource is available send properties to backend and get id
      if (!isNewUser && !token?.id && profile?.login) {
        await axios
          .get("/users")
          .then(async (res) => {
            if (res.data) {
              const _users = res.data;
              const user = _users.find(
                (user: any) => user.githubUsername === profile?.login
              );
              if (user) {
                token.user = {
                  ...user,
                  access_token: account?.access_token,
                };
                // TODO: remove this when auth is implemented in the backend
                // Temporary update existing users without email
                if (!user?.email && profile?.email) {
                  await updateUserProfile({
                    id: user.id,
                    email: profile?.email,
                    username: profile?.login,
                  });
                }
              } else {
                await createAndSetNewUser({
                  username: profile?.login,
                  email: profile?.email,
                });
              }
            }
          })
          .catch(() => (token.id = undefined));
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
export default NextAuth(authOptions);
