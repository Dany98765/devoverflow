"use server"

import User from "@/database/user.model";
import dbConnect from "../mongoose"
import logger from "../logger";
import Collection from "@/database/collection.model";
import "@/database/question.model";
import "@/database/tags.model";
import { auth } from "@/auth";

export async function saveToCollection({ id, email }) {
    await dbConnect()
    const user = await User.findOne({ email });
    if (!user) {
        logger.error("User not found.");
        return { success: false, message: "User not found." };
    }
    const author = user._id;
    try {
        const newCollectionQuestion = await Collection.create([{
            author,
            question: id
        }])
        return {
            success: true
        }
    } catch (error) {
        logger.error(error)
        throw new Error(error, error.message)
    }
}

export async function isSavedToCollection({ id, email }) {
    await dbConnect()
    const user = await User.findOne({ email });
    if (!user) {
        return { success: false, message: "User not found." };
    }
    const author = user._id;
    try {
        const questionInCollection = await Collection.findOne({
            author,
            question: id
        })
        if (questionInCollection){
            return {
                questionSavedInCollection: true
            }
        } else {
            return {
                questionSavedInCollection: false
            }
        }
    } catch (error) {
        logger.error(error)
        throw new Error(error, error.message)
    }
}

export async function deleteFromCollection({ id, email }) {
    await dbConnect()
    const user = await User.findOne({ email });
    if (!user) {
        logger.error("User not found.");
        return { success: false, message: "User not found." };
    }
    const author = user._id;
    try {
        await Collection.deleteOne({
            author,
            question: id
        })
        return {
            success: true
        }
    } catch (error) {
        logger.error(error)
        throw new Error(error, error.message)
    }
}

export async function getSavedQuestions({ email, query }) {
    await dbConnect()
    const user = await User.findOne({ email });
    if (!user) {
        logger.error("User not found.");
        return { success: false, message: "User not found." };
    }
    const author = user._id;
    const filterQuery = {}
    if (query) {
        filterQuery.$or = [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ];
    }
    try {
        const questions = await Collection.find({author})
            .populate({
            path: "question",
            select: "title description views upvotes downvotes answers createdAt tags author",
            populate: [
                {
                path: "author",
                select: "name image"
                },
                {
                path: "tags",
                select: "name"
                }
            ]
            })
        return {
            success: true,
            data: JSON.parse(JSON.stringify(questions))
        }
    } catch (error) {
        logger.error(error)
        return {
            success: false,
            error
        }
    }
}