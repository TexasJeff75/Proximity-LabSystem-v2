import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeftIcon, SendIcon } from 'lucide-react';
import { useMessaging } from './MessagingContext';
interface MessageThreadProps {
  sampleId: string;
  onBack: () => void;
}
export const MessageThread: React.FC<MessageThreadProps> = ({
  sampleId,
  onBack
}) => {
  const {
    messages,
    sendMessage
  } = useMessaging();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Get messages for this sample
  const threadMessages = messages.filter(msg => msg.sampleId === sampleId);
  const sampleName = threadMessages[0]?.sampleName || sampleId;
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [threadMessages]);
  // Handle sending a new message
  const handleSend = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };
  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  // Format timestamp
  const formatMessageTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: {
      date: string;
      messages: typeof threadMessages;
    }[] = [];
    let currentDate = '';
    threadMessages.forEach(msg => {
      const messageDate = new Date(msg.timestamp).toLocaleDateString();
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({
          date: messageDate,
          messages: [msg]
        });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });
    return groups;
  };
  const messageGroups = groupMessagesByDate();
  return <div className="flex flex-col h-full">
      {/* Thread header */}
      <div className="p-4 border-b border-gray-200 flex items-center">
        <button onClick={onBack} className="mr-3 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div>
          <h3 className="font-medium text-gray-900">{sampleName}</h3>
          <p className="text-xs text-gray-500">
            {threadMessages.length} messages
          </p>
        </div>
      </div>
      {/* Sample context */}
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">
          Sample Information
        </h4>
        <div className="text-sm text-gray-700">
          <p>
            <span className="font-medium">ID:</span> {sampleId}
          </p>
          <p>
            <span className="font-medium">Patient:</span>{' '}
            {sampleName.split(' - ')[0]}
          </p>
          <p>
            <span className="font-medium">Test:</span>{' '}
            {sampleName.split(' - ')[1] || 'Unknown'}
          </p>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messageGroups.map((group, groupIndex) => <div key={groupIndex} className="space-y-4">
            {/* Date separator */}
            <div className="flex items-center justify-center">
              <div className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-600">
                {new Date(group.date).toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
              </div>
            </div>
            {/* Messages for this date */}
            {group.messages.map(msg => <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                  {msg.sender !== 'user' && <p className="text-xs font-medium mb-1">{msg.senderName}</p>}
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 text-right ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatMessageTime(msg.timestamp)}
                  </p>
                </div>
              </div>)}
          </div>)}
        <div ref={messagesEndRef} />
      </div>
      {/* Composer */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center">
          <input type="text" placeholder="Type a message..." className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} />
          <button onClick={handleSend} disabled={!newMessage.trim()} className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 disabled:bg-blue-300">
            <SendIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>;
};