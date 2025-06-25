"use server"

import mongoose from "mongoose";
import dbConnect from "./mongoose";
import User from "@/database/user.model";
import { signIn } from "@/auth";

export async function signUpWithCredentials({ username, email, password }) {
    await dbConnect()
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const existingEmail = await User.findOne({ email }).session(session)
        if (existingEmail){
            logger.error("User already exists by email!")
            throw new Error("User already exists by email!")
        }
        logger.info("Bypassed email check!")
        const existingUsername = await User.findOne({ username }).session(session)
        if (existingUsername){
            logger.error("User already exists by username!")
            throw new Error("User already exists by username!")
        }
        logger.info("Bypassed username check!")
        logger.info("Bypassed email and username checks!")
        const hashedPassword = await bcrypt.hash(password, 12);
        const [newUser] = await User.create([{ username, email, password }], {
        session,
        });
        await Account.create(
            [
              {
                userId: newUser._id,
                provider: "credentials",
                providerAccountId: email,
                password: hashedPassword,
              },
            ],
            { session }
          );
          logger.info("Account created successfully for credentials'")
          await session.commitTransaction();
          await signIn("credentials", { email, password, redirect: false });
    } catch (error) {
        await session.abortTransaction()
    } finally {
        await session.endSession()
    }
}

// Await certain func(s)