import { useState, useCallback } from "react";
import { chatService } from "../services/chat.service.js";

/**
 * useChat - Custom hook for chat operations
 */
export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  /**
   * Send a message
   */
  const sendMessage = useCallback(async (messageData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await chatService.sendMessage(messageData);
      if (response.success) {
        setMessages((prev) => [...prev, response.data.message]);
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch conversation with a user
   */
  const fetchConversation = useCallback(async (userId, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await chatService.getConversation(userId, params);
      if (response.success) {
        setMessages(response.data.messages);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch all conversations
   */
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await chatService.getConversations();
      if (response.success) {
        setConversations(response.data.conversations);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch unread count
   */
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await chatService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (err) {
      console.error("Failed to fetch unread count:", err.message);
    }
  }, []);

  /**
   * Delete a message
   */
  const deleteMessage = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await chatService.deleteMessage(id);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    messages,
    conversations,
    loading,
    error,
    unreadCount,
    sendMessage,
    fetchConversation,
    fetchConversations,
    fetchUnreadCount,
    deleteMessage,
    setMessages,
    setConversations,
  };
};
