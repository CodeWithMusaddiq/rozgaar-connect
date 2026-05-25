import api from "./api.js";

/**
 * Chat API Service
 */
export const chatService = {
  /**
   * Send a message
   */
  sendMessage: async (messageData) => {
    const response = await api.post("/chat/send", messageData);
    return response.data;
  },

  /**
   * Get conversation with a user
   */
  getConversation: async (userId, params = {}) => {
    const response = await api.get(`/chat/conversation/${userId}`, { params });
    return response.data;
  },

  /**
   * Get all conversations
   */
  getConversations: async () => {
    const response = await api.get("/chat/conversations");
    return response.data;
  },

  /**
   * Get unread message count
   */
  getUnreadCount: async () => {
    const response = await api.get("/chat/unread-count");
    return response.data;
  },

  /**
   * Delete a message
   */
  deleteMessage: async (id) => {
    const response = await api.delete(`/chat/${id}`);
    return response.data;
  },
};
