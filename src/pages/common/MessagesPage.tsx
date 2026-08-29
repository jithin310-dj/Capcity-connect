import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { messageService } from '../../services/messageService';
import { storageService } from '../../services/storageService';
import { User, Message } from '../../types';
import { MessageSquare, Send, User as UserIcon, Clock, Sparkles } from 'lucide-react';

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
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <MessageSquare className="w-7 h-7 text-blue-600" />
          <span>Trainer & Trainee Knowledge Exchange</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Direct messaging channels for mentorship, question clarification, and course guidance.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[600px]">
        
        {/* Left: Contacts List */}
        <div className="border-r border-slate-200/80 flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversations</h3>
          </div>
          <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
            {allUsers.map((u) => {
              const isSelected = selectedUser?._id === u._id;
              return (
                <div
                  key={u._id}
                  onClick={() => setSelectedUser(u)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50/80' : 'hover:bg-slate-50'
                  }`}
                >
                  <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 truncate">{u.name}</p>
                      <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                        {u.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{u.organization}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Message Window */}
        <div className="md:col-span-2 flex flex-col justify-between bg-slate-50/40">
          {selectedUser ? (
            <>
              {/* Top active user bar */}
              <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={selectedUser.avatar} alt={selectedUser.name} className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{selectedUser.name}</h4>
                    <p className="text-[10px] text-slate-500">{selectedUser.designation} • {selectedUser.organization}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>

              {/* Chat history */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
                {messages.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 text-xs">
                    <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-2 opacity-50" />
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
                          className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                            isMe
                              ? 'bg-blue-600 text-white rounded-br-xs'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                          }`}
                        >
                          <p>{m.content}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Write a message to ${selectedUser.name}...`}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="p-8 text-center text-slate-400">Select a contact to begin messaging.</div>
          )}
        </div>

      </div>
    </div>
  );
};
