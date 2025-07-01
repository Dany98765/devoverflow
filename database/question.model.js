import { model, models, Schema } from "mongoose";

const QuestionSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    views: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    answers: { type: Number, default: 0 },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }]
  },
  { timestamps: true }
);

const Question = models?.Question || model("Question", QuestionSchema);

export default Question;