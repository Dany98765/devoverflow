import User from "@/database/user.model"
import logger from "@/utils/logger"
import Account from "@/database/account.model"
import mongoose from "mongoose"
import isEmail from "validator/lib/isEmail"
import dbConnect from "@/utils/mongoose"
import { NextResponse } from "next/server"

export async function POST(request) {
    await dbConnect()
    const { provider, providerAccountId, user } = await request.json()
    const session = await mongoose.startSession()
    session.startTransaction()
    try{
        const { name, image, username, email } = user
        if (name.length <= 1 || !isEmail(email) || typeof name !== "string" || typeof image !== "string" || typeof username !== "string" || typeof email !== "string"){
            logger.error("Invalid input!")
            throw new Error("Invalid input!")
        }
        const existingUser = await User.findOne({ email }).session(session)
        if (!existingUser){
            const newUser = await User.create([{name, image, username, email}], { session })
        } else {
            const updatedData = {name: "", image: ""};
            if (existingUser.name != name) updatedData.name = name
            if (existingUser.image != image) updatedData.image = image
        }
        const existingAccount = User.findOne({ 
            userId: existingUser._id,
            provider,
            providerAccountId
         }).session(session)
        if (!existingAccount){
            const newAccount = await Account.create([{
                name,
                image,
                email,
                provider,
                providerAccountId
            }], { session })
        }
        await session.commitTransaction();

        return NextResponse.json({ success: true });
    } catch(error){
        session.abortTransaction()
        return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });
    } finally{
        session.endSession()
        return NextResponse.json({ success: false, message: "Ended!" }, { status: 400 });
    }
}