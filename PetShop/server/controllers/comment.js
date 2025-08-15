import Comment from "../models/comment.js";
import CommentDetails from "../models/commentdetails.js";
import User from "../models/user.js";
import cloudinary from "cloudinary";
import { deleteImageOnCloudinary } from "./commentdetails.js";
cloudinary.config({
  cloud_name: process.env.REACT_APP_CLOUD_NAME,
  api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
  api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
  secure: true,
});

export const getComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    const commentDetails = await CommentDetails.find({
      comment: comment._id,
    });
    return res.status(200).json({
      _id: comment._id,
      user: comment.user,
      product: comment.product,
      content: comment.content,
      rating: comment.rating,
      createdAt: comment.createdAt,
      commentDetails_ids: commentDetails.map((item) => item._id),
      urls: commentDetails.map((item) => item.url),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCommentsByProduct = async (req, res) => {
  // console.log("req.query", req.query);
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 5;
  const limit = parseInt(req.query.limit) || 5;
  const { sortBy, rating } = req.query;
  // console.log("sort", sortBy);
  // console.log("rating", rating);
  try {
    const filter = {};
    if (rating) {
      filter.rating = rating;
    }
    let sortOption = {};
    switch (sortBy) {
      case "latest": // Latest
        sortOption.createdAt = -1;
        break;
      case "oldest": // Oldest
        sortOption.createdAt = 1;
        break;
    }
    const { productId } = req.params;
    const comments = await Comment.find({
      product: productId,
      ...filter,
    })
      .populate("user")
      .populate("product")
      .sort(sortOption)
      .skip(perPage * (page - 1))
      .limit(limit);

    // console.log(comments.length);
    if (comments.length < 1) {
      return res.status(400).json({ message: "No comments found" });
    }

    const count = await Comment.find({
      product: productId,
      ...filter,
    }).countDocuments();

    const commentsWithUrls = await Promise.all(
      comments.map(async (comment) => {
        const commentDetails = await CommentDetails.find({
          comment: comment._id,
        });
        return {
          _id: comment._id,
          user: comment.user,
          product: comment.product,
          content: comment.content,
          rating: comment.rating,
          createdAt: comment.createdAt,
          commentDetails_ids: commentDetails.map((item) => item._id),
          urls: commentDetails.map((item) => item.url),
          public_ids: commentDetails.map((item) => item.public_id),
        };
      })
    );

    return res.status(200).json({
      commentsWithUrls,
      current: page,
      pages: Math.ceil(count / perPage),
      total: count,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { userId, productId, content, rating, urls, public_ids } = req.body;
    const newComment = await Comment.create({
      user: userId,
      product: productId,
      content,
      rating,
    });

    const createdUrls = [];

    if (urls.length > 0) {
      for (let i = 0; i < urls.length; i++) {
        const newCommentDetails = await CommentDetails.create({
          comment: newComment._id,
          url: urls[i],
          public_id: public_ids[i],
        });
        createdUrls.push(newCommentDetails.url);
      }
    }

    return res.status(201).json({
      _id: newComment._id,
      userId: newComment.user,
      productId: newComment.product,
      content: newComment.content,
      rating: newComment.rating,
      createdAt: newComment.createdAt,
      updatedAt: newComment.updatedAt,
      urls: createdUrls,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found to delete" });
    }

    if (!comment.user.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
    }

    // Xóa comment
    await Comment.findByIdAndDelete(commentId);

    // Lấy chi tiết ảnh
    const commentDetails = await CommentDetails.find({ comment: commentId });

    if (commentDetails.length > 0) {
      // Xóa ảnh trên Cloudinary song song
      await Promise.all(
        commentDetails.map((item) => deleteImageOnCloudinary(item.public_id))
      );
      // Xóa record trong DB
      await CommentDetails.deleteMany({ comment: commentId });
    }

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content, rating, urls, public_ids } = req.body;
    // console.log(req.body);
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { content, rating },
      { new: true }
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment not found to delete" });
    }
    const createdUrls = [];
    if (urls.length > 0) {
      for (let i = 0; i < urls.length; i++) {
        const newCommentDetails = await CommentDetails.create({
          comment: comment._id,
          url: urls[i],
          public_id: public_ids[i],
        });
        createdUrls.push(newCommentDetails.url);
      }
    }
    return res.status(201).json({
      _id: comment._id,
      userId: comment.user,
      productId: comment.product,
      content: comment.content,
      rating: comment.rating,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      urls: createdUrls,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
