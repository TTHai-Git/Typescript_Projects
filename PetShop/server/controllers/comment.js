import Comment from "../models/comment.js";
import CommentDetails from "../models/commentdetails.js";
import User from "../models/user.js";
import Order from "../models/order.js";
import OrderDetails from "../models/orderdetails.js";
import { deleteImageOnCloudinary } from "./commentdetails.js";
import Payment from "../models/payment.js";
import "../config/dotenv.config.js"; // ✅ loads environment variables once
import { clearCacheByKeyword, getOrSetCachedData } from "./redis.js";

export const getComment = async (req, res) => {
  const { commentId } = req.params;
  const cacheKey = `GET:/v1/comments/${commentId}`;

  try {
    const commentData = await getOrSetCachedData(cacheKey, async () => {
      const comment = await Comment.findById(commentId);
      if (!comment) return null;

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
      };
    });

    if (!commentData) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json(commentData);
  } catch (error) {
    console.error("❌ Error fetching comment:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getCommentsByProduct = async (req, res) => {
  const { productId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 5;
  const limit = parseInt(req.query.limit) || 5;
  const { sortBy, rating } = req.query;

  try {
    const cacheKey = `GET:/v1/comments/product/${productId}?page=${page}&sortBy=${
      sortBy || "none"
    }&rating=${rating || "all"}`;

    const result = await getOrSetCachedData(cacheKey, async () => {
      const filter = {};
      if (rating) {
        filter.rating = rating;
      }

      let sortOption = {};
      switch (sortBy) {
        case "latest":
          sortOption.createdAt = -1;
          break;
        case "oldest":
          sortOption.createdAt = 1;
          break;
      }

      const comments = await Comment.find({
        product: productId,
        ...filter,
      })
        .populate("user")
        .populate("product")
        .sort(sortOption)
        .skip(perPage * (page - 1))
        .limit(limit);

      if (comments.length < 1) {
        return { commentsWithUrls: [], current: page, pages: 0, total: 0 };
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

      return {
        commentsWithUrls,
        current: page,
        pages: Math.ceil(count / perPage),
        total: count,
      };
    });

    if (!result || result.commentsWithUrls.length < 1) {
      return res.status(400).json({ message: "No comments found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error fetching comments by product:", error);
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

    // clear all data of comments
    clearCacheByKeyword("comments");

    return res.status(201).json({
      _id: newComment._id,
      userId: newComment.user,
      productId: newComment.product,
      content: newComment.content,
      rating: newComment.rating,
      createdAt: newComment.createdAt,
      updatedAt: newComment.updatedAt,
      urls: createdUrls,
      message: "Create comment successfully",
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

    if (!comment.user == req.user._id) {
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

    // clear all data of comments
    clearCacheByKeyword("comments");

    return res.status(204).send();
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
      return res.status(404).json({ message: "Comment not found to update" });
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

    // clear all data of comments
    clearCacheByKeyword("comments");

    return res.status(200).json({
      _id: comment._id,
      userId: comment.user,
      productId: comment.product,
      content: comment.content,
      rating: comment.rating,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      urls: createdUrls,
      message: "Update comment successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const checkIsOrderAndIsPayment = async (req, res) => {
  const { userId, productId } = req.params;
  // console.log("userId", userId);
  // console.log("productId", productId);
  try {
    const cacheKey = `GET:/v1/comments/user/${userId}/product/${productId}/check/is-make-orders-and-paid`;

    const result = await getOrSetCachedData(cacheKey, async () => {
      const orders = Order.find({ user: userId });
      for (const order of orders) {
        const hasProduct = await OrderDetails.exists({
          order: order._id,
          product: productId,
        });

        if (!hasProduct) continue;

        const paid = await Payment.exists({ order: order._id, status: "PAID" });
        if (paid) return true;
      }
      return false;
    });
    return res.status(200).json({ isPurchasedAndPaid: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `Somthing went wrong: ${error}` });
  }
};
