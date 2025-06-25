import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { api } from "./utils/extended-fetch";
import logger from "./utils/logger";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        const { data: existingAccount, success } =
          (await api.accounts.getByProvider(
            account.type === "credentials"
              ? token.email
              : account.providerAccountId
          ));

        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;

        if (userId) token.sub = userId.toString();
      }

      return token;
    },
    async signIn({ user, profile, account }) {
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;

      const userInfo = {
        name: user.name,
        email: user.email,
        image: user.image,
        username:
          account.provider === "github"
            ? (profile?.login)
            : (user.name?.toLowerCase()),
      };

      const response = (
        await api.auth.oAuthSignIn({
          user: userInfo,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
      })) ;

      logger.info("OAuth SignIn response:", response);

      if (!response || !response.success) {
        logger.error("No response in auth.js!")
        return false
      }
      return true;
    },
  },
});