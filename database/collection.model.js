import { model, models, Schema } from "mongoose";

const CollectionSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true }
  },
  { timestamps: true }
);

const Collection = models?.Collection || model("Collection", CollectionSchema);

export default Collection;