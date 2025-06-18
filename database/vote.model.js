import { model, models, Schema } from "mongoose";

const VoteSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ["Question", "Answer"], required: true },
    voteType: { type: String, enum: ["upvote", "downvote"], required: true }
  },
  { timestamps: true }
);

const Vote = models?.Vote || model("Vote", VoteSchema);

export default Vote;