import { model, models, Schema } from "mongoose";

const InteractionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    actionId: { type: Schema.Types.ObjectId, required: true },
    actionType: { type: String, enum: ["Question", "Answer"], required: true }
  }
);

const Interaction = models?.Interaction || model("Interaction", InteractionSchema);

export default Interaction;