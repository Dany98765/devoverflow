"use server"

import dbConnect from "../mongoose"
import Answer from "@/database/answer.model"
import mongoose from "mongoose"
import logger from "../logger"
import Question from "@/database/question.model"
import User from "@/database/user.model"

export async function createAnswer(questionId, formData, email) {
    await dbConnect()
    const description = formData.get("description")
    const user = await User.findOne({ email });
    if (!user) {
        logger.error("User not found.");
        return { success: false, message: "User not found." };
    }
    const author = user._id;
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        if (description.length < 50 || description.length > 1000){
            throw new Error("Answer's content must be between 50-1000 characters long!")
        }
        const authorId = typeof author === "string" ? author : author._id?.toString()
        const question = await Question.findById(questionId)
        const answer = await Answer.create([{
            author: authorId,
            question: questionId,
            content: description
        }], { session })
        question.answers += 1;
        await question.save({ session });
        const totalAnswers = await Answer.countDocuments({ question: questionId })
        question.answers = totalAnswers
        await session.commitTransaction()
        return {
            success: true,
            data: JSON.parse(JSON.stringify(answer))
        }
    } catch (error) {
        await session.abortTransaction()
        return {
            success: false, 
            error: true,
            message: error.message
        }
    } finally{
        session.endSession()
    }
   
}

export async function getAnswers({page = 1, pageSize = 10, filter, questionId}){
  await dbConnect()
  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  let sortCriteria = {};

  switch (filter) {
    case "latest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalAnswers = await Answer.countDocuments({ question: questionId });
    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id name image")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalAnswers > skip + answers.length;
    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        isNext,
        totalAnswers,
      },
    };
  } catch (error) {
    return {
        success: false,
        error: true,
        message: error.message
      };
  }
}