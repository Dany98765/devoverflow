"use server"

import mongoose from "mongoose"
import dbConnect from "../mongoose"
import logger from "../logger"
import Question from "@/database/question.model"
import { auth } from "@/auth"
import Tag from "@/database/tags.model"
import QuestionTags from "@/components/question-tags/page"
import User from "@/database/user.model"

export async function QuestionTag(formData) {
    const userSession = await auth()
    const userAccountId = userSession?.user?.id; // UUID
    const user = await User.findOne({ accountId: userAccountId }); // or email, etc.
    logger.info(`This is the user session: ${JSON.stringify(userSession)}, this is the user account ID: ${userAccountId} and this is the user session: ${JSON.stringify(userSession.user)}`)
    if (!user) {
      logger.error("User not found.");
      return;
    }
    const userId = user._id; // ✅ Mongoose ObjectId
    const title = formData?.get("title")
    const description = formData.get("description")
    const tags = formData.get("tags") || "[]"
    logger.info(title, description, tags + "??????????????????>>>>>>>>>>>>)))))))))")
    logger.info(tags)
    logger.error("Cannot retrieve Title formData!") 
    await dbConnect()
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const [question] = await Question.create({
            title,
            description,
            author: userId
        }, {
            session
        })
        const tagIds = [];
        const tagQuestionDocuments = [];
        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
              { name: { $regex: new RegExp(`^${tag}$`, "i") } },
              { $setOnInsert: { name: tag }, $inc: { questionCount: 1 } },
              { upsert: true, new: true, session }
            );
      
            tagIds.push(existingTag._id);
            tagQuestionDocuments.push({
              tag: existingTag._id,
              question: question._id,
            });
          }
      
          await QuestionTags.insertMany(tagQuestionDocuments, { session });
      
          await Question.findByIdAndUpdate(
            question._id,
            { $push: { tags: { $each: tagIds } } },
            { session }
          );
      
          await session.commitTransaction();
      
          return { success: true, data: JSON.parse(JSON.stringify(question)) };
    } catch (error) {
        logger.error(error)
        session.abortTransaction()
    } finally {
        session.endSession()
    }
}