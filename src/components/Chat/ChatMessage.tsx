import { Avatar, Card, Tag, Typography } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage as ChatMessageType } from '../../types';
import { formatDateTime, getSentimentColor } from '../../utils/formatters';

const { Text } = Typography;

interface ChatMessageProps {
  message: ChatMessageType;
}

function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className="chat-message"
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          gap: '12px',
          maxWidth: '80%',
        }}
      >
        <Avatar
          icon={isUser ? <UserOutlined /> : <RobotOutlined />}
          style={{
            backgroundColor: isUser ? '#1890ff' : '#52c41a',
            flexShrink: 0,
          }}
        />
        <Card
          size="small"
          style={{
            backgroundColor: isUser ? '#e6f7ff' : '#f6ffed',
            border: 'none',
          }}
        >
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Show extracted data for assistant messages */}
          {message.submission && (
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #d9d9d9' }}>
              {message.submission.sentiment && (
                <Tag color={getSentimentColor(message.submission.sentiment)}>
                  Sentiment: {message.submission.sentiment}
                </Tag>
              )}
              {message.submission.actionItems && message.submission.actionItems.length > 0 && (
                <Tag color="blue">
                  {message.submission.actionItems.length} Action Items
                </Tag>
              )}
              {message.submission.painPoints && message.submission.painPoints.length > 0 && (
                <Tag color="red">
                  {message.submission.painPoints.length} Pain Points
                </Tag>
              )}
            </div>
          )}

          <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '8px' }}>
            {formatDateTime(message.timestamp)}
          </Text>
        </Card>
      </div>
    </div>
  );
}

export default ChatMessage;
