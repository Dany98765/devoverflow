import User from "@/database/user.model";
import { NextResponse } from "next/server"
import isEmail from 'validator/lib/isEmail';
import dbConnect from "@/utils/mongoose";

export async function POST(request) {
    const { email } = await request.json()
    try{
        await dbConnect()
        if (!email){
            logger.error("Email not found!")
            return NextResponse.json("Email not found!")
        }
        if(!isEmail(email)){
            logger.error("Invalid Email!")
            return NextResponse.json("Invalid Email!")
        }
        const user = await User.findOne({ email })
        if (!user){
            logger.error("User not found by email!")
            return NextResponse.json("User not found by email!")
        }
        return NextResponse.json(user)
    } catch(error){
        return NextResponse.json("User not found!")
    }
}