"use server";

import mongoose from "mongoose";
import dbConnect from "../mongoose";
import logger from "../logger";
import Tag from "@/database/tags.model";
import User from "@/database/user.model";
import QuestionTag from "@/database/tag-question.model";
import { auth } from "@/auth";
import Question from "@/database/question.model";
import { error } from "console";

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

    if (title.length < 25 ||
      title.length > 100 ||
      description.length < 50 ||
      description.length > 1000 ||
      rawTags.length < 2) {
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
        { $setOnInsert: { name: tag }, $inc: { questionCount: 1 } },
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
  logger.info(questionId)
  const userAccountId = userSession?.user?.id;
  const user = await User.findOne({ email });
  const userId = user._id;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (title.length < 15 ||
      title.length > 80 ||
      description.length < 50 ||
      description.length > 1000 ||
      rawTags.length < 2) {
      throw new Error("Invalid question input!")
    } else {
      logger.info("BYPASSED CHECK!!!")
    }
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      logger.error("Invaklid>>>>>>>>>>>>")
      throw new Error("Invalid question ID format");
    }

    const question = await Question.findById(questionId).populate("tags")
    logger.info("Fetched question? ", question);

    if (!question) {
      throw new Error("Question not found");
    }

    if (question.author.toString() !== userId) {
      throw new Error("Unauthorized");
    }
    logger.info(title, question.title)
    if (question.title !== title || question.description !== description) {
      question.title = title;
      logger.info(question.title, title + "Updated title!!!!!!!")
      question.description = description;
      logger.info("Type check", typeof question.description, typeof description);
      await question.save({ session });

      logger.info("Edited!!")
    } else {
      logger.error("No fields were updated!")
    }

    const currentTagNames = question.tags.map(tag => tag.name.toLowerCase());

    const tagsToAdd = tags.filter(
      (tag) => !currentTagNames.includes(tag.toLowerCase())
    );

    const tagsToRemove = question.tags.filter(
      (tag) => !tags.map(t => t.toLowerCase()).includes(tag.name.toLowerCase())
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
    logger.error("editQuestion failed:", {
      message: error?.message,
      stack: error?.stack,
      full: error,
    });
    await session.abortTransaction();
    return { success: false, message: "Question creation failed." };
  } finally {
    session.endSession();
  }
}

export async function getQuestion({ questionId }) {
  try {
    await dbConnect();
    const question = await Question.findById(questionId)
      .populate("tags")
      .populate("author", "name image")

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

export async function getQuestions(params) {
  await dbConnect()
  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  const filterQuerySearch = {};

  if (filter === "recommended") {
    return { success: true, data: { questions: [], isNext: false } };
  }

  if (query) {
    filterQuerySearch.$or = [
      { title: { $regex: new RegExp(query, "i") } },
      { content: { $regex: new RegExp(query, "i") } },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case "frequent":
      sortCriteria = { createdAt: -1 };
      break;
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "unanswered":
      filterQuerySearch.answers = 0;
      sortCriteria = { createdAt: -1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalQuestions = await Question.countDocuments(filterQuerySearch);

    const questions = await Question.find(filterQuerySearch)
      .populate("tags", "name")
      .populate("author", "name image")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
    };

  } catch (error) {
    logger.error(error)
    return {
      success: false,
      //data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
    };
  }
}

export async function incrementViews({ questionId }) {

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    question.views += 1;

    await question.save();

    revalidatePath(ROUTES.QUESTION(questionId));

    return {
      success: true,
      error: false,
      data: { views: question.views },
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: error.message
    };
  }
}