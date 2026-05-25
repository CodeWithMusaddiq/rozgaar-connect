import mongoose from "mongoose";

/**
 * Message Schema
 * For chat between applicants and job owners
 */
const messageSchema = new mongoose.Schema(
  {
    // The conversation this message belongs to
    conversationId: {
      type: String,
      required: true,
      // Format: "userId1_userId2" (sorted to ensure consistency)
    },
    // Sender of the message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Recipient of the message
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Message content
    content: {
      type: String,
      required: [true, "Message content is required"],
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    // Message type
    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
    // File URL (for image/file messages)
    fileUrl: {
      type: String,
      default: "",
    },
    // Read status
    isRead: {
      type: Boolean,
      default: false,
    },
    // Read timestamp
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for chat queries
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, recipient: 1 });
messageSchema.index({ recipient: 1, isRead: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
