import { model, models, Schema } from "mongoose"

const UserSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true }, 
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    img: { type: String },
    location: { type: String },
    portofolio: { type: String },
    reputation: { type: Number, default: 0 },
    accountId: { type: String, unique: true }
}, { timestamps: true }
)

const User = models?.User || model("User", UserSchema)

export default User