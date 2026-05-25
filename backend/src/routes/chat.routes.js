import express from "express";
import {
  sendMessage,
  getConversation,
  getConversations,
  getUnreadCount,
  deleteMessage,
} from "../controllers/chat.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All chat routes are protected
router.post("/send", protect, sendMessage);
router.get("/conversations", protect, getConversations);
router.get("/conversation/:userId", protect, getConversation);
router.get("/unread-count", protect, getUnreadCount);
router.delete("/:id", protect, deleteMessage);

export default router;
