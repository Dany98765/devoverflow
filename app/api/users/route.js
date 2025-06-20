import dbConnect from "@/utils/mongoose";
import User from "@/database/user.model";
import logger from "@/utils/logger";
import { NextResponse } from "next/server";
import validateUser from "@/utils/user-validation";

export async function GET(){
    try{
        await dbConnect()
        const users = await User.find();
        logger.info("Connected successfully to mongoose database..")
        return NextResponse.json(users)
    } catch (error){
        logger.error("Failed to connect to database!")
    }
}
export async function POST(req){
    try{
        await dbConnect()
        const user = await req.json()
        const { email, username } = user
        if (!validateUser(user)){
            logger.error("Invalid user input!")
            return NextResponse.json("Invalid user input! -- NextResponse")
        }
        const existingEmail = await User.findOne({ email })
        if(existingEmail){
            logger.error("Email Already exists!")
            return NextResponse.json("Email Already exists! -- NextResponse")
        }
        const existingUsername = await User.findOne({ username })
        if(existingUsername){
            logger.error("Username Already exists!")
            return NextResponse.json("Username Already exists! -- NextResponse")
        }
        const newUser = User.create(user)
        if (validateUser(user)){
            return NextResponse.json(newUser)
        }
    } catch (error){
        const user = req.json()
        if (validateUser(user)){
            return logger.error("Failed to create user to database!")
        }
    }
}