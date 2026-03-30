import { useEffect, useRef } from 'react';
import { Spin } from 'antd';
import ChatMessage from './ChatMessage';
import { EmptyState } from '../common';
import type { ChatMessage as ChatMessageType } from '../../types';
import { MessageOutlined } from '@ant-design/icons';

interface ChatHistoryProps {
  messages: ChatMessageType[];
  loading?: boolean;
}

function ChatHistory({ messages, loading }: ChatHistoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0 && !loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <EmptyState
          icon={<MessageOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />}
          title="No messages yet"
          description="Submit a transcript, meeting notes, or feedback to get started"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        overflow: 'auto',
        padding: '24px',
      }}
    >
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
          <Spin tip="Processing..." />
        </div>
      )}
    </div>
  );
}

export default ChatHistory;
