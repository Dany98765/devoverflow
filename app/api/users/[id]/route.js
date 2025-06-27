// import User from "@/database/user.model"
// import logger from "@/utils/logger"
// import dbConnect from "@/utils/mongoose"
// import { NextResponse } from "next/server"

// export async function GET(_, {params}) {
//     const { id } = await params
//     if (!id){
//         logger.error("User ID not found!")
//         return NextResponse.json("User ID not found!")
//     }
//     try{
//         await dbConnect()
//         const user = await User.findById(id)
//         if (!user){
//             logger.error("User not found!")
//             return NextResponse.json("User not found!")
//         }
//         return NextResponse.json(user)
//     } catch(error){
//         logger.error("Failed to retrieve user by ID!")
//     }
// }
// export async function DELETE(_, {params}) {
//     const { id } = await params
//     console.log(id + ".............................................................")
//     if (!id){
//         logger.error("User ID not found!")
//         return NextResponse.json("User ID not found!")
//     }
//     try{
//         await dbConnect()
//         const user = await User.findByIdAndDelete(id)
//         if (!user){
//             logger.error("User not found!")
//             return NextResponse.json("User not found!")
//         }
//         return NextResponse.json("User deleted successfully")
//     } catch(error){
//         logger.error("Failed to retrieve user by ID!")
//     }
// }
// export async function PUT(_, {params}) {
//     const { id } = await params
//     if (!id){
//         logger.error("User ID not found!")
//         return NextResponse.json("User ID not found!")
//     }
//     try{
//         await dbConnect()
//         const user = await req.json()
//         const { email, username } = user
//         if (!validateUser(user)){
//             logger.error("Invalid user input!")
//             return NextResponse.json("Invalid user input! -- NextResponse")
//         }
//         const existingEmail = await User.findOne({ email })
//         if(existingEmail){
//             logger.error("Email Already exists!")
//             return NextResponse.json("Email Already exists! -- NextResponse")
//         }
//         const existingUsername = await User.findOne({ username })
//         if(existingUsername){
//             logger.error("Username Already exists!")
//             return NextResponse.json("Username Already exists! -- NextResponse")
//         }
//         const updatedUser = await User.findByIdAndUpdate(id, user, { new: true })
//         if (!user){
//             logger.error("User not found!")
//             return NextResponse.json("User not found!")
//         }
//         return NextResponse.json("User deleted successfully")
//     } catch(error){
//         logger.error("Failed to retrieve user by ID!")
//     }
// }
import User from "@/database/user.model";
import logger from "@/utils/logger";
import dbConnect from "@/utils/mongoose";
import { NextResponse } from "next/server";
import validateUser from "@/utils/validation/user-validation";
import mongoose from "mongoose";

export async function GET(_, { params }) {
  const { id } = params;

  await dbConnect()

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    logger.error("User ID not found or invalid!");
    return NextResponse.json({ error: "Invalid or missing User ID" }, { status: 400 });
  }

  try {
    await dbConnect();
    const user = await User.findById(id);
    if (!user) {
      logger.error("User not found!");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    logger.error("Failed to retrieve user by ID!", { error: error.message });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  const { id } = params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    logger.error("User ID not found or invalid!");
    return NextResponse.json({ error: "Invalid or missing User ID" }, { status: 400 });
  }

  try {
    await dbConnect();
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      logger.error("User not found!");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error("Failed to delete user by ID!", { error: error.message });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    logger.error("User ID not found or invalid!");
    return NextResponse.json({ error: "Invalid or missing User ID" }, { status: 400 });
  }

  try {
    await dbConnect();
    const user = await req.json();
    const { email, username } = user;

    if (!validateUser(user)) {
      logger.error("Invalid user input!");
      return NextResponse.json({ error: "Invalid user input" }, { status: 400 });
    }

    const existingEmail = await User.findOne({ email, _id: { $ne: id } });
    if (existingEmail) {
      logger.error("Email already exists!");
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const existingUsername = await User.findOne({ username, _id: { $ne: id } });
    if (existingUsername) {
      logger.error("Username already exists!");
      return NextResponse.json({ error: "Username already exists" }, { status: 409 });
    }

    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    if (!updatedUser) {
      logger.error("User not found!");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    NextResponse.json({ error: "User updated successfully!" }, { status: 201 });
    return NextResponse.json(updatedUser);
  } catch (error) {
    logger.error("Failed to update user by ID!", { error: error.message });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
