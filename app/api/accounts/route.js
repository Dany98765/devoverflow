import dbConnect from "@/utils/mongoose";
import Account from "@/database/account.model";
import logger from "@/utils/logger";
import { NextResponse } from "next/server";
import validateAccount from "@/utils/account-validation";

export async function GET(){
    try{
        await dbConnect()
        const accounts = await Account.find();
        logger.info("Connected successfully to mongoose database..")
        return NextResponse.json(accounts)
    } catch (error){
        logger.error("Failed to connect to database!")
        return NextResponse.json("Failed to connect to database!")
    }
}
export async function POST(req){
    try{
        await dbConnect()
        const account = await req.json()
        const { provider, providerAccountId } = account
        if (!validateAccount(account)){
            logger.error("Invalid account input!")
            return NextResponse.json("Invalid account input! -- NextResponse")
        }
        const existingAccount = await Account.findOne({ provider, providerAccountId })
        if(existingAccount){
            logger.error("Account Already exists!")
            return NextResponse.json("Account Already exists! -- NextResponse")
        }
        const newAccount = await Account.create(account)
        return NextResponse.json(newAccount)
    } catch (error){
        return NextResponse.json("Failed to connect to database!")
    }
}