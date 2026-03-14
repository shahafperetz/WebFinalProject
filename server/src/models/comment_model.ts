import mongoose, { InferSchemaType } from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

commentSchema.index({ createdAt: -1 });

export type CommentDoc = InferSchemaType<typeof commentSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default mongoose.model("Comment", commentSchema);