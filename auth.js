import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import logger from "./utils/logger";
import Credentials from 'next-auth/providers/credentials'
import { api } from "./utils/extended-fetch";
import bcrypt from "bcryptjs"
import User from "./database/user.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google,
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials
        logger.info(credentials)
        logger.info(`Successful!ksjijfifhu😏😏😏`)
        console.log("Inside authorize function");
        try {
            const existingAccountResponse = await api.accounts.getByProvider(email);
            const existingAccount = existingAccountResponse.data;
            if (!existingAccount) return null;
            logger.info(existingAccount, existingAccountResponse)

            logger.info(`Successful!😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏`, existingAccount, existingAccountResponse)
          } catch (error) {
            logger.error(`This: ${error} is the error!😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏😏`)
          }
          //const existingAccountResponse = await api.accounts.getByProvider(email);
          const existingUserResponse = await api.users.getById(existingAccount.userId.toString());
          const existingUser = existingUserResponse.data;
          logger.info(existingAccount, existingUser, existingUserResponse)
          if (!existingUser) return null;
          const isValidPassword = await bcrypt.compare(password, existingAccount.password);
          logger.info("Password validated successfully!")
          if (!isValidPassword) return null;
          // return {
          //   id: existingUser.id,
          //   email: existingUser.email,
          //   image: existingUser.image,
          // };
          return {
            id: existingUser._id.toString(),
            email: existingUser.email,
            name: existingUser.name,
            image: existingUser.image || null,
          };
      }
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
    // async jwt({ token, account }) {
    //   if (account) {
    //     const { data: existingAccount, success } =
    //       (await api.accounts.getByProvider(
    //         account.type === "credentials"
    //           ? token.email
    //           : account.providerAccountId
    //       ));

    //     if (!success || !existingAccount) return token;

    //     const userId = existingAccount.userId;

    //     if (userId) token.sub = userId.toString();
    //   }

    //   return token;
    // },
    async jwt({ token, account }) {
      if (account) {
        const { data: existingAccount, success } = await api.accounts.getByProvider({
          provider: account.provider,
          providerAccountId: account.provider === "credentials"
            ? token.email
            : account.providerAccountId,
        });
    
        if (success && existingAccount?.userId) {
          token.sub = existingAccount.userId.toString();
        }
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