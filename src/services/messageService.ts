import { storageService } from './storageService';
import { Message, UserRole } from '../types';
import { soundUtility } from '../utils/soundUtility';

export const messageService = {
  getMessagesForUser(userId: string): Message[] {
    const all = storageService.getMessages();
    return all.filter((m) => m.senderId === userId || m.receiverId === userId);
  },

  getConversation(user1Id: string, user2Id: string): Message[] {
    const all = storageService.getMessages();
    return all.filter(
      (m) =>
        (m.senderId === user1Id && m.receiverId === user2Id) ||
        (m.senderId === user2Id && m.receiverId === user1Id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  sendMessage(
    senderId: string,
    senderName: string,
    senderRole: UserRole,
    senderAvatar: string,
    receiverId: string,
    receiverName: string,
    receiverRole: UserRole,
    content: string
  ): Message {
    const messages = storageService.getMessages();
    const conversationId = [senderId, receiverId].sort().join('_');

    const newMsg: Message = {
      _id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      senderName,
      senderRole,
      senderAvatar,
      receiverId,
      receiverName,
      receiverRole,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };

    storageService.setMessages([...messages, newMsg]);
    soundUtility.playMessageSound();
    return newMsg;
  },

  markConversationAsRead(userId: string, senderId: string): void {
    const messages = storageService.getMessages();
    let updated = false;
    messages.forEach((m) => {
      if (m.receiverId === userId && m.senderId === senderId && !m.read) {
        m.read = true;
        updated = true;
      }
    });
    if (updated) {
      storageService.setMessages(messages);
    }
  }
};
