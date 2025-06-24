import Account from "@/database/account.model"
import { NextResponse } from "next/server"
import dbConnect from "@/utils/mongoose"

export async function POST(request) {
    const { providerAccountId } = await request.json()
    try{
        await dbConnect()
        if (!providerAccountId){
            logger.error("ProviderAccountID not found!")
            return NextResponse.json("ProviderAccountID not found!")
        }
        const account = await Account.find({ providerAccountId })
        if (!account){
            logger.error("Acocunt not found by ProviderAccountID!")
            return NextResponse.json("Acocunt not found by ProviderAccountID!")
        }
        return NextResponse.json(account)
    } catch(error){
        return NextResponse.json("User not found!" + error)
    }
}