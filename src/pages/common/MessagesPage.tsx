import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { messageService } from '../../services/messageService';
import { storageService } from '../../services/storageService';
import { soundUtility } from '../../utils/soundUtility';
import { User, Message } from '../../types';
import { MessageSquare, Send, User as UserIcon, Clock, ArrowLeft, Users } from 'lucide-react';

interface MessagesPageProps {
  targetUserId?: string;
  onNavigate?: (view: string, payload?: any) => void;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({ targetUserId }) => {
  const { user } = useAuth();
  const currentUserId = user?._id || 'u-trainee-1';

  const allUsers = storageService.getUsers().filter((u) => u._id !== currentUserId);
  const [selectedUser, setSelectedUser] = useState<User | null>(
    allUsers.find((u) => u._id === targetUserId) || allUsers[0] || null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState<boolean>(!!targetUserId);

  useEffect(() => {
    if (selectedUser && user) {
      const conv = messageService.getConversation(currentUserId, selectedUser._id);
      setMessages(conv);
      messageService.markConversationAsRead(currentUserId, selectedUser._id);
    }
  }, [selectedUser, currentUserId, user]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedUser || !user) return;

    const newMsg = messageService.sendMessage(
      user._id,
      user.name,
      user.role,
      user.avatar,
      selectedUser._id,
      selectedUser.name,
      selectedUser.role,
      inputText.trim()
    );

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    soundUtility.playMessageSound();
  };

  const handleSelectContact = (u: User) => {
    setSelectedUser(u);
    setMobileShowChat(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <MessageSquare className="w-7 h-7 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>Trainer & Trainee Exchange</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Direct messaging channels for mentorship, question clarification, and course guidance.
        </p>
      </div>

      <div className="bg-white dark:bg-[#151B28] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[520px] md:min-h-[600px] transition-colors">
        
        {/* Left: Contacts List (Hidden on mobile if chat is open) */}
        <div className={`border-r border-slate-200 dark:border-slate-800 flex-col ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Conversations</h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {allUsers.length} Contacts
            </span>
          </div>
          <div className="overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 flex-1 max-h-[500px] md:max-h-none">
            {allUsers.map((u) => {
              const isSelected = selectedUser?._id === u._id;
              return (
                <div
                  key={u._id}
                  onClick={() => handleSelectContact(u)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-900/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900/40'
                  }`}
                >
                  <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{u.name}</p>
                      <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                        {u.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{u.organization}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Message Window (Hidden on mobile if contacts view is active) */}
        <div className={`md:col-span-2 flex-col justify-between bg-slate-50/40 dark:bg-[#0E131F] ${!mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
          {selectedUser ? (
            <>
              {/* Top active user bar */}
              <div className="p-3.5 sm:p-4 bg-white dark:bg-[#151B28] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    onClick={() => setMobileShowChat(false)}
                    className="md:hidden p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Back to contacts"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <img src={selectedUser.avatar} alt={selectedUser.name} className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{selectedUser.name}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{selectedUser.designation} • {selectedUser.organization}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>

              {/* Chat history */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 max-h-[380px] sm:max-h-[460px]">
                {messages.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 dark:text-slate-500 text-xs">
                    <MessageSquare className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2 opacity-50" />
                    <p>Start a conversation with {selectedUser.name}.</p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.senderId === currentUserId;
                    return (
                      <div
                        key={m._id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                            isMe
                              ? 'bg-blue-600 text-white rounded-br-xs'
                              : 'bg-white dark:bg-[#151B28] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs'
                          }`}
                        >
                          <p className="break-words">{m.content}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white dark:bg-[#151B28] border-t border-slate-200 dark:border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={inputText || ''}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Write a message to ${selectedUser.name}...`}
                  className="flex-1 px-3.5 sm:px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="p-8 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center h-full">
              <Users className="w-10 h-10 mb-2 opacity-50" />
              <p>Select a contact to begin messaging.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

