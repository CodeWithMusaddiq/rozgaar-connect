import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Generate consistent conversation ID from two user IDs
 */
const getConversationId = (userId1, userId2) => {
  return [userId1.toString(), userId2.toString()].sort().join("_");
};

/**
 * @desc    Send a message
 * @route   POST /api/chat/send
 * @access  Private
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { recipientId, content, messageType, fileUrl } = req.body;

  if (!recipientId || !content) {
    throw new ApiError(400, "Recipient ID and content are required");
  }

  // Verify recipient exists
  const recipient = await User.findById(recipientId);
  if (!recipient) {
    throw new ApiError(404, "Recipient not found");
  }

  // Prevent messaging self
  if (recipientId === req.user._id.toString()) {
    throw new ApiError(400, "Cannot send message to yourself");
  }

  const conversationId = getConversationId(req.user._id, recipientId);

  const message = await Message.create({
    conversationId,
    sender: req.user._id,
    recipient: recipientId,
    content,
    messageType: messageType || "text",
    fileUrl: fileUrl || "",
  });

  const populatedMessage = await Message.findById(message._id)
    .populate("sender", "fullName avatar")
    .populate("recipient", "fullName avatar");

  res.status(201).json(
    new ApiResponse(201, { message: populatedMessage }, "Message sent successfully")
  );
});

/**
 * @desc    Get conversation between two users
 * @route   GET /api/chat/conversation/:userId
 * @access  Private
 */
export const getConversation = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  const conversationId = getConversationId(req.user._id, userId);
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const messages = await Message.find({ conversationId })
    .populate("sender", "fullName avatar")
    .populate("recipient", "fullName avatar")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: 1 });

  // Mark messages as read where current user is recipient
  await Message.updateMany(
    {
      conversationId,
      recipient: req.user._id,
      isRead: false,
    },
    { isRead: true, readAt: new Date() }
  );

  const total = await Message.countDocuments({ conversationId });

  res.status(200).json(
    new ApiResponse(200, {
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    }, "Conversation fetched successfully")
  );
});

/**
 * @desc    Get all conversations for logged-in user
 * @route   GET /api/chat/conversations
 * @access  Private
 */
export const getConversations = asyncHandler(async (req, res) => {
  // Get all unique conversation IDs where user is sender or recipient
  const userMessages = await Message.find({
    $or: [{ sender: req.user._id }, { recipient: req.user._id }],
  }).sort({ createdAt: -1 });

  // Group by conversation and get latest message + unread count
  const conversationMap = new Map();

  for (const msg of userMessages) {
    const otherUserId = msg.sender.toString() === req.user._id.toString()
      ? msg.recipient.toString()
      : msg.sender.toString();

    if (!conversationMap.has(otherUserId)) {
      conversationMap.set(otherUserId, {
        otherUserId,
        lastMessage: msg,
        unreadCount: 0,
      });
    }

    // Count unread messages where current user is recipient
    if (
      msg.recipient.toString() === req.user._id.toString() &&
      !msg.isRead
    ) {
      conversationMap.get(otherUserId).unreadCount += 1;
    }
  }

  // Get other user details
  const conversations = [];
  for (const [otherUserId, data] of conversationMap) {
    const otherUser = await User.findById(otherUserId).select("fullName avatar role shopName");
    if (otherUser) {
      conversations.push({
        user: otherUser,
        lastMessage: {
          content: data.lastMessage.content,
          createdAt: data.lastMessage.createdAt,
          sender: data.lastMessage.sender,
        },
        unreadCount: data.unreadCount,
      });
    }
  }

  res.status(200).json(
    new ApiResponse(200, { conversations }, "Conversations fetched successfully")
  );
});

/**
 * @desc    Get unread message count
 * @route   GET /api/chat/unread-count
 * @access  Private
 */
export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Message.countDocuments({
    recipient: req.user._id,
    isRead: false,
  });

  res.status(200).json(
    new ApiResponse(200, { unreadCount: count }, "Unread count fetched")
  );
});

/**
 * @desc    Delete a message
 * @route   DELETE /api/chat/:id
 * @access  Private
 */
export const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  // Only sender can delete their message
  if (message.sender.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own messages");
  }

  await Message.findByIdAndDelete(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, "Message deleted successfully")
  );
});
