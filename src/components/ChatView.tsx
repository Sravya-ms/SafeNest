import React, { useState, useEffect, useRef } from 'react';
import { User, ChatConversation, ChatMessage } from '../types';
import { storage } from '../services/storageService';
import {
  MessageSquare,
  Send,
  ShieldCheck,
  Building,
  User as UserIcon,
  CheckCheck,
  Lock,
  Sparkles
} from 'lucide-react';

interface ChatViewProps {
  currentUser: User;
  initialConversationId?: string | null;
  onOpenProperty?: (propertyId: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  currentUser,
  initialConversationId,
  onOpenProperty
}) => {
  const [conversations, setConversations] = useState<ChatConversation[]>(() =>
    storage.getConversations(currentUser.id)
  );

  const [selectedConvId, setSelectedConvId] = useState<string>(
    initialConversationId || (conversations[0]?.id ?? '')
  );

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    selectedConvId ? storage.getMessages(selectedConvId) : []
  );

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = storage.getConversations(currentUser.id);
    setConversations(list);
    if (!selectedConvId && list.length > 0) {
      setSelectedConvId(list[0].id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedConvId) {
      setMessages(storage.getMessages(selectedConvId));
    }
  }, [selectedConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeConversation = conversations.find(c => c.id === selectedConvId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedConvId) return;

    const newMsg = storage.sendMessage(selectedConvId, currentUser, inputMessage.trim());
    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');
    setConversations(storage.getConversations(currentUser.id));
  };

  const sendQuickReply = (text: string) => {
    if (!selectedConvId) return;
    const newMsg = storage.sendMessage(selectedConvId, currentUser, text);
    setMessages(prev => [...prev, newMsg]);
    setConversations(storage.getConversations(currentUser.id));
  };

  const getCounterpartName = (conv: ChatConversation) => {
    return currentUser.role === 'TENANT' ? conv.ownerName : conv.tenantName;
  };

  const getCounterpartRole = (conv: ChatConversation) => {
    return currentUser.role === 'TENANT' ? 'Property Owner' : 'Verified Tenant';
  };

  const quickReplies = currentUser.role === 'TENANT' ? [
    'Is this property available for move-in next month?',
    'I have submitted my application with employment verification.',
    'Signed the digital agreement! Awaiting owner confirmation.',
    'Can we schedule a 10-minute video walkthrough?'
  ] : [
    'Yes, the property is ready for immediate occupancy.',
    'Your lease application is approved! Digital agreement sent.',
    'The maintenance technician is scheduled for tomorrow at 11 AM.',
    'Payment confirmed and verified in escrow.'
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm h-[720px] flex flex-col md:flex-row animate-in fade-in duration-150">
      {/* Left Sidebar: Conversations List */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50">
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare size={16} className="text-teal-600" />
              <span>Direct Messages</span>
            </h2>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800">
              {conversations.length} Active
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-teal-700 bg-teal-50/70 p-2 rounded-lg border border-teal-100">
            <Lock size={12} className="shrink-0" />
            <span>Private masked channel. No personal mobile exchange required.</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No conversations started yet. Apply for a property or inquire to begin messaging.
            </div>
          ) : (
            conversations.map(conv => {
              const isSelected = conv.id === selectedConvId;
              const counterpart = getCounterpartName(conv);
              const roleTitle = getCounterpartRole(conv);

              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`w-full p-4 text-left transition-colors flex items-start gap-3 ${
                    isSelected ? 'bg-white shadow-sm border-l-4 border-l-teal-600' : 'hover:bg-slate-100/70'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0 mt-0.5">
                    {counterpart.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {counterpart}
                      </span>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {conv.lastMessageTime}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-teal-700 block truncate">
                      {roleTitle} · {conv.propertyTitle}
                    </span>
                    <p className="text-[11px] text-slate-500 truncate mt-1">
                      {conv.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Side: Active Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {activeConversation ? (
          <>
            {/* Chat Top Banner */}
            <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0">
                  {getCounterpartName(activeConversation).charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {getCounterpartName(activeConversation)}
                    </h3>
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {getCounterpartRole(activeConversation)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                    <Building size={12} className="text-slate-400" />
                    <span>{activeConversation.propertyTitle}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-medium shrink-0">
                <ShieldCheck size={14} className="text-teal-600" />
                <span className="hidden sm:inline">Phone numbers masked for safety</span>
                <span className="sm:hidden">Masked ID</span>
              </div>
            </div>

            {/* Messages Thread View */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
              {messages.map(msg => {
                if (msg.isSystemNote) {
                  return (
                    <div key={msg.id} className="py-2 text-center">
                      <span className="inline-block px-3 py-1 bg-teal-50 border border-teal-200 text-teal-900 rounded-full text-[11px] font-medium shadow-2xs">
                        {msg.text}
                      </span>
                    </div>
                  );
                }

                const isMe = msg.senderId === currentUser.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5 px-1">
                      <span>{isMe ? 'You' : msg.senderName}</span>
                      <span>·</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-2xs ${
                        isMe
                          ? 'bg-teal-600 text-white rounded-br-xs'
                          : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies Bar */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
                <Sparkles size={11} className="text-teal-600" /> Quick Replies:
              </span>
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendQuickReply(reply)}
                  className="px-2.5 py-1 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-full text-slate-700 hover:text-teal-800 whitespace-nowrap transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a secure message (e.g. Discuss move-in dates, parking, or maintenance)..."
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl transition-colors shrink-0 shadow-sm"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <MessageSquare size={36} className="text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">No Conversation Selected</p>
            <p className="text-xs text-slate-500 mt-1">Select a conversation from the sidebar or inquire about a property.</p>
          </div>
        )}
      </div>
    </div>
  );
};
