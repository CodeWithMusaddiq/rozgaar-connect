import React, { useState, useEffect, useRef } from "react";
import { dummyConversations, getConversationMessages } from "../data/dummyChats.js";
import {
  Send, Phone, MoreVertical, Search, ChevronLeft,
  Loader2, CheckCheck, Clock, Paperclip, Smile,
} from "lucide-react";

const MessageIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

/** Avatar with initials fallback */
const Avatar = ({ src, name = "", size = "md", online = false }) => {
  const [imgError, setImgError] = useState(false);
  const sizeMap = { sm: "w-8 h-8 text-xs", md: "w-11 h-11 text-sm" };
  const dotMap  = { sm: "w-2.5 h-2.5",    md: "w-3 h-3" };
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="relative shrink-0">
      {src && !imgError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          className={`${sizeMap[size]} rounded-xl object-cover`}
        />
      ) : (
        <div className={`${sizeMap[size]} rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold`}>
          {initials || "?"}
        </div>
      )}
      {online && (
        <span className={`absolute -bottom-0.5 -right-0.5 ${dotMap[size]} bg-green-500 border-2 border-white rounded-full`} />
      )}
    </div>
  );
};

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput]   = useState("");
  const [searchQuery,  setSearchQuery]    = useState("");
  const [conversations, setConversations] = useState([]);
  const [messages,      setMessages]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [typing,        setTyping]        = useState(false);
  const messagesEndRef = useRef(null);

  /* ── Load conversations ── */
  useEffect(() => {
    const timer = setTimeout(() => {
      setConversations(dummyConversations);
      setLoading(false);
      if (dummyConversations.length > 0) {
        const first = dummyConversations[0];
        setSelectedChat(first);
        setMessages(getConversationMessages(first._id));
      }
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  /* ── Auto-scroll ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectChat = (conv) => {
    setSelectedChat(conv);
    setMessages(getConversationMessages(conv._id));
    setConversations((prev) =>
      prev.map((c) => (c._id === conv._id ? { ...c, unread: 0 } : c))
    );
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat) return;

    const newMsg = {
      _id: `new_${Date.now()}`,
      sender: "user",
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setMessageInput("");

    // Update last message in sidebar
    setConversations((prev) =>
      prev.map((c) =>
        c._id === selectedChat._id
          ? { ...c, lastMessage: newMsg.text, time: newMsg.time }
          : c
      )
    );

    // Typing → reply
    setTimeout(() => setTyping(true), 800);
    setTimeout(() => {
      setTyping(false);
      const replies = [
        "That sounds great! When can you start?",
        "Thanks for the update. Let me check and get back to you.",
        "Perfect! Please bring your documents tomorrow.",
        "Sure, we can discuss the salary in person.",
        "I appreciate your interest. Can you share your experience?",
      ];
      const replyMsg = {
        _id: `reply_${Date.now()}`,
        sender: "owner",
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, replyMsg]);
      setConversations((prev) =>
        prev.map((c) =>
          c._id === selectedChat._id
            ? { ...c, lastMessage: replyMsg.text, time: replyMsg.time }
            : c
        )
      );
    }, 2800);
  };

  const filteredConversations = conversations.filter((conv) =>
    (conv.fullName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#F3F4F6] min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 h-[calc(100vh-64px)]">
        <div className="flex h-full bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">

          {/* ── Sidebar ── */}
          <div className={`w-full sm:w-80 lg:w-96 border-r border-gray-100 flex flex-col shrink-0 ${selectedChat ? "hidden sm:flex" : "flex"}`}>
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-gray-100">
              <h1 className="text-lg font-bold text-[#0F172A] mb-4">Messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations…"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#F3F4F6] rounded-xl text-sm outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <MessageIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No conversations found</p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const active = selectedChat?._id === conv._id;
                  return (
                    <button
                      key={conv._id}
                      onClick={() => handleSelectChat(conv)}
                      className={`w-full flex items-center gap-3 px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors text-left ${active ? "bg-[#F1F5F9]" : ""}`}
                    >
                      <Avatar src={conv.avatar} name={conv.fullName} size="md" online={conv.online} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-sm font-semibold text-[#0F172A] truncate">
                            {conv.fullName}
                          </span>
                          <span className="text-xs text-gray-400 shrink-0 ml-2">{conv.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unread > 0 && (
                        <span className="w-5 h-5 bg-[#0F172A] text-white rounded-full text-xs flex items-center justify-center shrink-0 font-medium">
                          {conv.unread}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Chat Area ── */}
          <div className={`flex-1 flex flex-col min-w-0 ${selectedChat ? "flex" : "hidden sm:flex"}`}>
            {selectedChat ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-white shrink-0">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedChat(null)}
                      className="sm:hidden p-1.5 -ml-1 text-[#374151] hover:bg-[#F3F4F6] rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <Avatar src={selectedChat.avatar} name={selectedChat.fullName} size="sm" online={selectedChat.online} />
                    <div>
                      <h2 className="font-semibold text-[#0F172A] text-sm leading-none mb-0.5">
                        {selectedChat.fullName}
                      </h2>
                      <p className={`text-xs flex items-center gap-1 ${selectedChat.online ? "text-green-600" : "text-gray-400"}`}>
                        {selectedChat.online ? (
                          <><span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" /> Online</>
                        ) : (
                          <><Clock className="w-3 h-3" /> Last seen recently</>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-[#374151] hover:bg-[#F3F4F6] rounded-xl transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-[#374151] hover:bg-[#F3F4F6] rounded-xl transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-[#FAFAFA]">
                  <div className="flex justify-center mb-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-xs">Today</span>
                  </div>

                  {messages.map((msg, index) => {
                    const isMe = msg.sender === "user";
                    const prevSender = index > 0 ? messages[index - 1].sender : null;
                    const showAvatar = !isMe && prevSender !== msg.sender;

                    return (
                      <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2`}>
                        {/* Other person avatar */}
                        {!isMe && (
                          <div className="w-8 shrink-0">
                            {showAvatar && (
                              <Avatar src={selectedChat.avatar} name={selectedChat.fullName} size="sm" />
                            )}
                          </div>
                        )}

                        <div className={`max-w-[70%] sm:max-w-[60%] flex flex-col gap-0.5 ${isMe ? "items-end" : "items-start"}`}>
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              isMe
                                ? "bg-[#0F172A] text-white rounded-br-md"
                                : "bg-white text-[#374151] rounded-bl-md shadow-sm border border-gray-100"
                            }`}
                          >
                            {msg.text}
                          </div>
                          <div className={`flex items-center gap-1 px-1 ${isMe ? "justify-end" : ""}`}>
                            <span className="text-xs text-gray-400">{msg.time}</span>
                            {isMe && <CheckCheck className="w-3 h-3 text-blue-400" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing indicator */}
                  {typing && (
                    <div className="flex items-end gap-2">
                      <Avatar src={selectedChat.avatar} name={selectedChat.fullName} size="sm" />
                      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                        <div className="flex gap-1 items-center h-4">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="px-4 py-3 border-t border-gray-100 bg-white shrink-0">
                  <div className="flex items-center gap-2">
                    <button type="button" className="p-2 text-gray-400 hover:text-[#374151] transition-colors shrink-0">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message…"
                      className="flex-1 px-4 py-2.5 bg-[#F3F4F6] rounded-xl text-sm outline-none placeholder:text-gray-400"
                    />
                    <button type="button" className="p-2 text-gray-400 hover:text-[#374151] transition-colors shrink-0">
                      <Smile className="w-4 h-4" />
                    </button>
                    <button
                      type="submit"
                      disabled={!messageInput.trim()}
                      className="p-2.5 bg-[#0F172A] text-white rounded-xl hover:bg-[#1e293b] disabled:bg-gray-200 disabled:text-gray-400 transition-colors shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-[#FAFAFA]">
                <div className="text-center text-gray-400 px-6">
                  <MessageIcon className="w-14 h-14 mx-auto mb-4 opacity-20" />
                  <p className="text-base font-semibold text-[#0F172A] mb-1">Select a conversation</p>
                  <p className="text-sm">Choose a chat from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChatPage;