"use server"

import Question from "@/database/question.model";
import Answer from "@/database/answer.model";
import User from "@/database/user.model";
import Vote from "@/database/vote.model";
import mongoose from "mongoose";
import dbConnect from "../mongoose";
import logger from "../logger";

export async function handleVoteAction({ email, id, type, voteType  }) {
    await dbConnect()
    const user = await User.findOne({ email });
    if (!user) {
        logger.error("User not found.");
        return { success: false, message: "User not found." };
    }
    let oppositeVoteType;
    if (voteType == "upvotes"){
        oppositeVoteType = "downvotes"
    } else if (voteType == "downvotes") {
        oppositeVoteType = "upvotes"
    }
    let model = type == "Question" ? Question : Answer
    const author = user._id;
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const existingVote = await Vote.findOne({ 
            author,
            id, 
            type,
         })
         logger.info(type)
         if (existingVote){
            if (existingVote.voteType === voteType){
                await Vote.deleteOne({ _id: existingVote._id }).session(session)
                const q = await model.findByIdAndUpdate(
                    id,
                    { $inc: { [voteType]: -1 } },
                    { new: true, session }
                )
            } else {
                await Vote.findByIdAndUpdate(
                    existingVote._id,
                    { voteType },
                    { new: true, session }
                )
                const updatedQ = await model.findByIdAndUpdate(
                    id,
                    { $inc: { [voteType]: 1 , [oppositeVoteType]: -1 }},
                    { new: true, session }
                )
            }
        } else {
            const newVote = await Vote.create([{
                author,
                id,
                type,
                voteType
            }], session)
            await model.findByIdAndUpdate(
                id,
                { $inc: { [voteType]: 1 } },
                { new: true, session }
            )
        }
        await session.commitTransaction()
        return {
            success: true,
        }
    } catch (error) {
        await session.abortTransaction()
        return {
            success: false, 
            error: true,
            message: error.message
        }
    } finally {
        session.endSession()
    }
}

export async function hasVoted({ email, id, type }) {
    await dbConnect()
    const user = await User.findOne({ email });
    console.log(user)
    const author = user?._id;
    const vote = await Vote.findOne({
        author,
        id,
        type
      });
  
      if (!vote) {
        return {
          hasVotesSuccess: false,
          data: { hasUpvoted: false, hasDownvoted: false },
        };
      }
  
      return {
        hasVotesSuccess: true,
        data: {
          hasUpvoted: vote.voteType === "upvotes",
          hasDownvoted: vote.voteType === "downvotes",
        },
      };
}