import React, { useEffect, useState, useRef } from 'react';
import { XIcon, Search as SearchIcon } from 'lucide-react';
import { useMessaging, Message } from './MessagingContext';
import { MessageThread } from './MessageThread';
export const MessagingPanel: React.FC = () => {
  const {
    isOpen,
    setIsOpen,
    messages,
    activeSampleId,
    setActiveSampleId,
    markAsRead
  } = useMessaging();
  const [searchTerm, setSearchTerm] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  // Effect to mark messages as read when viewing a sample
  useEffect(() => {
    if (activeSampleId) {
      markAsRead(activeSampleId);
    }
  }, [activeSampleId, markAsRead]);
  // Group messages by sample
  const groupedMessages: Record<string, Message[]> = messages.reduce((acc, message) => {
    if (!acc[message.sampleId]) {
      acc[message.sampleId] = [];
    }
    acc[message.sampleId].push(message);
    return acc;
  }, {} as Record<string, Message[]>);
  // Filter samples by search term
  const filteredSamples = Object.keys(groupedMessages).filter(sampleId => {
    const sampleName = groupedMessages[sampleId][0]?.sampleName || '';
    return sampleId.toLowerCase().includes(searchTerm.toLowerCase()) || sampleName.toLowerCase().includes(searchTerm.toLowerCase());
  });
  // Check if a sample has unread messages
  const hasUnreadMessages = (sampleId: string) => {
    return groupedMessages[sampleId].some(msg => !msg.read);
  };
  // Get the latest message for a sample
  const getLatestMessage = (sampleId: string) => {
    const sampleMessages = groupedMessages[sampleId];
    return sampleMessages[sampleMessages.length - 1];
  };
  // Format timestamp
  const formatTimestamp = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return messageDate.toLocaleDateString([], {
        month: 'short',
        day: 'numeric'
      });
    }
  };
  if (!isOpen) return null;
  return <div ref={panelRef} className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-xl border-l border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100">
          <XIcon className="h-5 w-5" />
        </button>
      </div>
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search messages..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeSampleId ? <MessageThread sampleId={activeSampleId} onBack={() => setActiveSampleId(null)} /> : <div className="divide-y divide-gray-200">
            {filteredSamples.length > 0 ? filteredSamples.map(sampleId => {
          const latestMessage = getLatestMessage(sampleId);
          const sampleName = latestMessage.sampleName || sampleId;
          return <div key={sampleId} className={`p-4 hover:bg-gray-50 cursor-pointer ${hasUnreadMessages(sampleId) ? 'bg-blue-50' : ''}`} onClick={() => setActiveSampleId(sampleId)}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium text-gray-900">
                        {sampleName}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(latestMessage.timestamp)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 truncate w-64">
                        <span className="font-medium mr-1">
                          {latestMessage.sender === 'user' ? 'You:' : `${latestMessage.senderName.split(' ')[0]}:`}
                        </span>
                        {latestMessage.content}
                      </p>
                      {hasUnreadMessages(sampleId) && <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {groupedMessages[sampleId].filter(m => !m.read).length}
                        </span>}
                    </div>
                  </div>;
        }) : <div className="p-8 text-center text-gray-500">
                No messages match your search
              </div>}
          </div>}
      </div>
    </div>;
};