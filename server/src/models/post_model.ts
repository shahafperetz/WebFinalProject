import mongoose, { InferSchemaType } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    image: { type: String, default: "" },

    // לשימוש בהמשך (Likes/Comments)
    likes: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });

export type PostDoc = InferSchemaType<typeof postSchema> & { _id: mongoose.Types.ObjectId };

export default mongoose.model("Post", postSchema);