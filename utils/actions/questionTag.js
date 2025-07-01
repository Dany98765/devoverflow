"use server";

import mongoose from "mongoose";
import dbConnect from "../mongoose";
import logger from "../logger";
import Question from "@/database/question.model";
import Tag from "@/database/tags.model";
import User from "@/database/user.model";
import QuestionTag from "@/database/tag-question.model"; 
import { auth } from "@/auth";

// Escape regex metacharacters
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function createQuestion(formData) {
  await dbConnect();

  const userSession = await auth();
  const email = userSession?.user?.email;
  const userAccountId = userSession?.user?.id;

  const user = await User.findOne({ email });
  if (!user) {
    logger.error("User not found.");
    return { success: false, message: "User not found." };
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = user._id;
    const title = formData.get("title");
    const description = formData.get("description");
    const rawTags = formData.get("tags"); 
    const tags = JSON.parse(rawTags);   

    if (title.length < 15 ||
        title.length > 80 ||
        description.length < 50 ||
        description.length > 300 ||
        rawTags.length < 2)
        {
          throw new Error("Invalid question input!")
        }

    const [question] = await Question.create(
      [
        {
          title,
          description,
          author: userId,
        },
      ],
      { session }
    );

    const tagIds = [];
    const tagQuestionDocuments = [];

    for (const tag of tags) {
      const safeTag = escapeRegex(tag);
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${safeTag}$`, "i") } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session }
      );

      tagIds.push(existingTag._id);
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    }
    
    // Associate tags with question in intermediate model
    await QuestionTag.insertMany(tagQuestionDocuments, { session });

    // Update question with list of tags
    await Question.findByIdAndUpdate(
      question._id,
      { $push: { tags: { $each: tagIds } } },
      { session }
    );

    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    logger.error("Question creation failed", error);
    await session.abortTransaction();
    return { success: false, message: "Question creation failed." };
  } finally {
    session.endSession();
  }
}
export async function editQuestion(formData) {
  await dbConnect();
  const title = formData.get("title");
  const description = formData.get("description");
  const rawTags = formData.get("tags"); 
  const tags = JSON.parse(rawTags);   
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    
  } catch (error) {
    
    await session.abortTransaction();
    return { success: false, message: "Question creation failed." };
  } finally {
    session.endSession();
  }
}
