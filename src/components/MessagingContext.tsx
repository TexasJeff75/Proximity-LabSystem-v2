import React, { createContext, useContext, useState, ReactNode } from 'react';
// Define message type
export interface Message {
  id: string;
  sampleId: string;
  sampleName?: string;
  sender: 'user' | 'other';
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
}
interface MessagingContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: Message[];
  unreadCount: number;
  activeSampleId: string | null;
  setActiveSampleId: (id: string | null) => void;
  sendMessage: (content: string) => void;
  markAsRead: (sampleId: string) => void;
}
// Create context with default values
const MessagingContext = createContext<MessagingContextType>({
  isOpen: false,
  setIsOpen: () => {},
  messages: [],
  unreadCount: 0,
  activeSampleId: null,
  setActiveSampleId: () => {},
  sendMessage: () => {},
  markAsRead: () => {}
});
// Mock data for messages
const mockMessages: Message[] = [{
  id: '1',
  sampleId: 'S001',
  sampleName: 'John Doe - CBC',
  sender: 'other',
  senderName: 'Dr. Sarah Johnson',
  content: 'Please expedite this sample. The patient is waiting for results.',
  timestamp: new Date('2024-01-15T09:30:00'),
  read: false
}, {
  id: '2',
  sampleId: 'S001',
  sampleName: 'John Doe - CBC',
  sender: 'user',
  senderName: 'You',
  content: 'I, ll, prioritize, it, right, away, : .Should, be, ready, within, the, hour, : ., \',: timestamp, new: Date(\'2024-01-15T09:35:00\')',
  read: true
}, {
  id: '3',
  sampleId: 'S002',
  sampleName: 'Jane Smith - Urinalysis',
  sender: 'other',
  senderName: 'Dr. Emily Rodriguez',
  content: 'Are there any abnormal findings in this sample?',
  timestamp: new Date('2024-01-15T10:15:00'),
  read: false
}, {
  id: '4',
  sampleId: 'S003',
  sampleName: 'Mike Johnson - Lipid Panel',
  sender: 'other',
  senderName: 'Dr. Michael Chen',
  content: 'This is marked as urgent. When can we expect results?',
  timestamp: new Date('2024-01-14T14:20:00'),
  read: false
}, {
  id: '5',
  sampleId: 'S003',
  sampleName: 'Mike Johnson - Lipid Panel',
  sender: 'user',
  senderName: 'You',
  content: 'We, re, working, on, it, now, : .Should, be, completed, by, EOD, : ., \',: timestamp, new: Date(\'2024-01-14T14:25:00\')',
  read: true
}];
export const MessagingProvider: React.FC<{
  children: ReactNode;
}> = ({
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);
  // Calculate unread count
  const unreadCount = messages.filter(m => !m.read).length;
  // Send a new message
  const sendMessage = (content: string) => {
    if (!activeSampleId || !content.trim()) return;
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      sampleId: activeSampleId,
      sampleName: messages.find(m => m.sampleId === activeSampleId)?.sampleName,
      sender: 'user',
      senderName: 'You',
      content,
      timestamp: new Date(),
      read: true
    };
    setMessages([...messages, newMessage]);
  };
  // Mark all messages for a sample as read
  const markAsRead = (sampleId: string) => {
    setMessages(messages.map(msg => msg.sampleId === sampleId ? {
      ...msg,
      read: true
    } : msg));
  };
  return <MessagingContext.Provider value={{
    isOpen,
    setIsOpen,
    messages,
    unreadCount,
    activeSampleId,
    setActiveSampleId,
    sendMessage,
    markAsRead
  }}>
      {children}
    </MessagingContext.Provider>;
};
export const useMessaging = () => useContext(MessagingContext);