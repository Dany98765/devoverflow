import { model, models, Schema } from "mongoose";

const QuestionTagSchema = new Schema(
  {
    tag: { type: Schema.Types.ObjectId, ref: "Tag" },
    question: { type: Schema.Types.ObjectId, ref: "Question" }
  },
  { timestamps: true }
);

const QuestionTag = models?.QuestionTag || model("QuestionTag", QuestionTagSchema);

export default QuestionTag;