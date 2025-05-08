import Comment from "../models/comment.js";
import CommentDetails from "../models/commentdetails.js";
import User from "../models/user.js";

export const getComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await CommentDetails.findById(commentId).populate(
      "comment"
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    return res.status(200).json(comment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCommnetsByProduct = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 5;
  const limit = parseInt(req.query.limin) || 5;
  try {
    const { productId } = req.params;
    const comments = await Comment.find({ product: productId })
      .populate("user")
      .populate("product")
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(limit);

    if (!comments.length) {
      return res.status(404).json({ message: "No comments found" });
    }

    const count = await Comment.find({ product: productId }).countDocuments();
    const commentsWithUrls = await Promise.all(
      comments.map(async (comment) => {
        const urls = await CommentDetails.find({ comment: comment._id });
        return {
          _id: comment._id,
          user: comment.user,
          product: comment.product,
          content: comment.content,
          rating: comment.rating,
          createdAt: comment.createdAt,
          urls: urls.map((url) => url.url),
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
    const { userId, productId, content, rating, urls } = req.body;

    const newComment = await Comment.create({
      user: userId,
      product: productId,
      content,
      rating,
    });

    const createdUrls = [];

    if (urls.length > 0) {
      for (const url of urls) {
        const newCommentDetails = await CommentDetails.create({
          comment: newComment._id,
          url: url,
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
