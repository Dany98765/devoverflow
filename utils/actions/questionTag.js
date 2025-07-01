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
  logger.info("User found successfully!")
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
        description.length > 1000 ||
        rawTags.length < 2)
        {
          throw new Error("Invalid question input!")
        }
    logger.info("Question fields were validated successfully!")
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
    logger.info(`This is the author: ${JSON.stringify(question.author.toString())} and this is userID: ${JSON.stringify(userId)}`)

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
    logger.info("Tags pushed successfully!")
    // Associate tags with question in intermediate model
    await QuestionTag.insertMany(tagQuestionDocuments, { session });
    logger.info("Insermany works")
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
  const userSession = await auth();
  const email = userSession.user.email
  const title = formData.get("title");
  const description = formData.get("description");
  const rawTags = formData.get("tags"); 
  const tags = JSON.parse(rawTags);   
  const questionId = formData.get("questionId")
  const userAccountId = userSession?.user?.id;
  const user = await User.findOne({ email });
  const userId = user._id;
  const session = await mongoose.startSession();
  session.startTransaction();
  try{
    if (title.length < 15 ||
      title.length > 80 ||
      description.length < 50 ||
      description.length > 1000 ||
      rawTags.length < 2)
      {
        throw new Error("Invalid question input!")
      }
    logger.info(questionId)
    const question = await Question.findById(questionId).populate("tags");
    logger.info(question)
    if (!question) {
      throw new Error("Question not found");
    }

    if (question.author.toString() !== userId) {
      throw new Error("Unauthorized");
    }

    if (question.title !== title || question.description !== description) {
      question.title = title;
      question.content = description;
      await question.save({ session });
      logger.info("Edited!!")
    } else{
      logger.error("No fields were updated!")
    }

    const tagsToAdd = tags.filter(
      (tag) => !question.tags.includes(tag.toLowerCase())
    );
    const tagsToRemove = question.tags.filter(
      (tag) => !tags.includes(tag.name.toLowerCase())
    );
    logger.info("Tags filtered!")
    const newTagDocuments = [];

    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${tag}$`, "i") } },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, new: true, session }
        );

        if (existingTag) {
          newTagDocuments.push({
            tag: existingTag._id,
            question: questionId,
          });

          question.tags.push(existingTag._id);
          logger.info("Tags pushed!")
        }
      }
    }
    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map((tag) => tag._id);

      await Tag.updateMany(
        { _id: { $in: tagIdsToRemove } },
        { $inc: { questions: -1 } },
        { session }
      );
      logger.info("UpdateMany!")
      await QuestionTag.deleteMany(
        { tag: { $in: tagIdsToRemove }, question: questionId },
        { session }
      );
      logger.info("DeleteMany!")
      question.tags = question.tags.filter(
        (tagId) => !tagsToRemove.includes(tagId)
      );
    }

    if (newTagDocuments.length > 0) {
      await QuestionTag.insertMany(newTagDocuments, { session });
    }

    await question.save({ session });
    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    await session.abortTransaction();
    return { success: false, message: "Question creation failed." };
  } finally {
    session.endSession();
  }
}
export async function getQuestion({ questionId }) {
  try {
    await dbConnect();
    const question = await Question.findById(questionId);

    if (!question) {
      return { success: false, message: "Question not found" };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)), // to make it serializable
    };
  } catch (error) {
    return { success: false, message: "Error fetching question" };
  }
}
