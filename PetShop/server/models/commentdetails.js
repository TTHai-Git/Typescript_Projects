import { model, Schema } from "mongoose";

const CommentDetailsSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
});
const CommentDetails = model("CommentDetails", CommentDetailsSchema);
export default CommentDetails;
