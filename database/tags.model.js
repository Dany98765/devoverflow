import { model, models, Schema } from "mongoose";
import { unique } from "next/dist/build/utils";

const TagSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    questionCount: { type: Number ,default: 0 },
  },
  { timestamps: true }
);

const Tag = models?.Tag || model("Tag", TagSchema);

export default Tag;