import User from "@/database/user.model"
import logger from "@/utils/logger"
import dbConnect from "@/utils/mongoose"
import { NextResponse } from "next/server"

export async function GET(_, {params}) {
    const { id } = await params
    if (!id){
        logger.error("User ID not found!")
        return NextResponse.json("User ID not found!")
    }
    try{
        await dbConnect()
        const user = await User.findById(id)
        if (!user){
            logger.error("User not found!")
            return NextResponse.json("User not found!")
        }
        return NextResponse.json(user)
    } catch(error){
        logger.error("Failed to retrieve user by ID!")
    }
}
export async function DELETE(_, {params}) {
    const { id } = await params
    if (!id){
        logger.error("User ID not found!")
        return NextResponse.json("User ID not found!")
    }
    try{
        await dbConnect()
        const user = await User.findByIdAndDelete(id)
        if (!user){
            logger.error("User not found!")
            return NextResponse.json("User not found!")
        }
        return NextResponse.json("User deleted successfully")
    } catch(error){
        logger.error("Failed to retrieve user by ID!")
    }
}
export async function PUT(_, {params}) {
    const { id } = await params
    if (!id){
        logger.error("User ID not found!")
        return NextResponse.json("User ID not found!")
    }
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
        const updatedUser = await User.findByIdAndUpdate(id, user, { new: true })
        if (!user){
            logger.error("User not found!")
            return NextResponse.json("User not found!")
        }
        return NextResponse.json("User deleted successfully")
    } catch(error){
        logger.error("Failed to retrieve user by ID!")
    }
}