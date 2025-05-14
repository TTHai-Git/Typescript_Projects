import CommentDetails from "../models/commentdetails.js";
import cloudinary from "cloudinary";
cloudinary.config({
  cloud_name: process.env.REACT_APP_CLOUD_NAME,
  api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
  api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
  secure: true,
});

export const deleteImageOnCloudinary = async (public_id) => {
  try {
    const response = await cloudinary.v2.uploader.destroy(public_id);
    if (response.result === "ok") {
      console.log("Image deleted successfully from Cloudinary");
      return response;
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
};

export const deleteCommentDetails = async (req, res) => {
  try {
    const { commentDetailsId } = req.params;
    const commentDetails = await CommentDetails.findById(commentDetailsId);
    if (!commentDetails) {
      return res.status(404).json({ message: "Comment details not found" });
    } else {
      const deletedCommentDetails = await CommentDetails.findByIdAndDelete(
        commentDetailsId
      );
      if (!deletedCommentDetails) {
        return res
          .status(404)
          .json({ message: "Comment details not found to delete" });
      } else {
        const deletedUrls = await deleteImageOnCloudinary(
          commentDetails.public_id
        );
        return res
          .status(204)
          .json({ message: "Delete Comment Details Successfully" });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
