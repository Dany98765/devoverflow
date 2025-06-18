import { model, models, Schema } from "mongoose";

const TagSchema = new Schema(
  {
    name: { type: String, required: true },
    questionCount: { type: Number ,default: 0 },
  },
  { timestamps: true }
);

const Tag = models?.Tag || model("Tag", TagSchema);

export default Tag;