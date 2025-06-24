import Account from "@/database/account.model";
import logger from "@/utils/logger";
import dbConnect from "@/utils/mongoose";
import { NextResponse } from "next/server";
import validateAccount from "@/utils/account-validation";
import mongoose from "mongoose";

export async function GET(_, { params }) {
  const { id } = params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    logger.error("Account ID not found or invalid!");
    return NextResponse.json({ error: "Invalid or missing Account ID" }, { status: 400 });
  }

  try {
    await dbConnect();
    const account = await Account.findById(id);
    if (!account) {
      logger.error("Account not found!");
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    return NextResponse.json(account);
  } catch (error) {
    logger.error("Failed to retrieve account by ID!", { error: error.message });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  const { id } = params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    logger.error("Account ID not found or invalid!");
    return NextResponse.json({ error: "Invalid or missing Account ID" }, { status: 404 });
  }

  try {
    await dbConnect();
    const account = await Account.findByIdAndDelete(id);
    if (!account) {
      logger.error("Account not found!");
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    logger.error("Failed to delete Account by ID!", { error: error.message });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    logger.error("Account ID not found or invalid!");
    return NextResponse.json({ error: "Invalid or missing account ID" }, { status: 400 });
  }

  try {
    await dbConnect();
    const account = await req.json();
    const { email, accountname } = account;

    if (!validateAccount(account)) {
      logger.error("Invalid account input!");
      return NextResponse.json({ error: "Invalid account input" }, { status: 400 });
    }

    const existingEmail = await Account.findOne({ email, _id: { $ne: id } });
    if (existingEmail) {
      logger.error("Email already exists!");
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const existingaccountname = await Account.findOne({ accountname, _id: { $ne: id } });
    if (existingaccountname) {
      logger.error("accountname already exists!");
      return NextResponse.json({ error: "Account name already exists" }, { status: 409 });
    }

    const updatedaccount = await Account.findByIdAndUpdate(id, account, { new: true });
    if (!updatedaccount) {
      logger.error("account not found!");
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    NextResponse.json({ error: "Account updated successfully!" }, { status: 201 });
    return NextResponse.json(updatedaccount);
  } catch (error) {
    logger.error("Failed to update account by ID!", { error: error.message });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
