"use server"

import mongoose from "mongoose";
import dbConnect from "@/utils/mongoose";
import User from "@/database/user.model";
import Account from "@/database/account.model";
import { signIn } from "@/auth";
import logger from "../logger";
import bcrypt from "bcrypt";
import { validateUsername } from "../validation/backend-validation/username-validation";
import { validateEmail } from "../validation/backend-validation/email-validation";
import { validatePassword } from "../validation/backend-validation/password-validation";

export async function signUpWithCredentials(formData) {
    logger.info(formData)
    const name = formData.get("name")
    const username = formData.get("username")
    const email = formData.get("email")
    const password = formData.get("password")
    await dbConnect()
    const session = await mongoose.startSession()
    let committed = false
    session.startTransaction()
    try {
        if (!validateUsername(username)){
            logger.error("Invalid username!")
            throw new Error("Invalid username!")
        }
        if (!validateEmail(email)){
            logger.error("Invalid email!")
            throw new Error("Invalid email!")
        }
        if (!validatePassword(password)){
            logger.error("Invalid password!")
            throw new Error("Invalid password!")
        }
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
        const hashedPassword = await bcrypt.hash(password, 12)
        const [newUser] = await User.create([{ name, username, email }], {
        session,
        });
        logger.info("USER CREATED SUCCESSFULLY!")        
        await Account.create(
            [
              {
                userId: newUser._id,
                name: name,
                provider: "credentials",
                providerAccountId: email,
                password: hashedPassword,
              },
            ],
            { session }
          );
         
          await session.commitTransaction();
          committed = true
          await signIn("credentials", { username: username, name: name, email: email, password: password, redirect: false });
    } catch (error) {
        if(!committed){
            await session.abortTransaction()
        }
    } finally {
        await session.endSession()
    }
}

// Await certain func(s)