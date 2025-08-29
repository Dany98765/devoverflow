import User from "@/database/user.model";
import Account from "@/database/account.model";
import logger from "@/utils/logger";
import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail";
import dbConnect from "@/utils/mongoose";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect(); 

  const { provider, providerAccountId, user } = await request.json();
  const session = await mongoose.startSession();
  session.startTransaction();
  logger.info(`Provider: ${provider} , ProviderAccountId: ${providerAccountId}, User: ${JSON.stringify(user, null, 2)}`)
  try {
    const { name, image, username, email } = user;

    if (
      name.length <= 1 ||
      !isEmail(email) ||
      typeof name !== "string" ||
      typeof image !== "string" ||
      typeof username !== "string" ||
      typeof email !== "string"
    ) {
      throw new Error("Invalid input!");
    }
    let existingUser = await User.findOne({ email }).session(session);
    if (!existingUser) {
      [existingUser] = await User.create(
        [{ name, image, username, email }],
        { session }
      ); 
    } else {
      const updatedData = {};
      if (existingUser.name !== name) updatedData.name = name;
      if (existingUser.image !== image) updatedData.image = image;

      if (Object.keys(updatedData).length > 0) {
        await User.updateOne({ _id: existingUser._id }, updatedData, {
          session,
        });
      }
    }    
    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    }).session(session);
    if (!existingAccount) {
      await Account.create(
        [
          {
            userId: existingUser._id, 
            name,
            //image,
            email,
            provider,
            providerAccountId,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();
    return NextResponse.json({ success: true }); 
  } catch (error) {
    await session.abortTransaction();
    logger.error("OAuth Signin Error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid input or server error" },
      { status: 400 }
    );
  } finally {
    session.endSession();
  }
}
