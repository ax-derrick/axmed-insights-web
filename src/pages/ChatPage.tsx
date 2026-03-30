import { useState } from 'react';
import { Typography, message } from 'antd';
import { ChatHistory, ChatInput } from '../components/Chat';
import { processTranscript } from '../services/n8n';
import type { ChatMessage, SubmissionType } from '../types';

const { Title } = Typography;

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const addMessage = (role: 'user' | 'assistant', content: string, submission?: ChatMessage['submission']) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date().toISOString(),
      submission,
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const handleSubmit = async (content: string, type: SubmissionType) => {
    // Add user message
    addMessage('user', content);
    setLoading(true);

    try {
      // Process through N8N
      const result = await processTranscript(content, type, 'user@axmed.co');

      // Build response message
      let responseContent = '## Analysis Complete\n\n';

      if (result.summary) {
        responseContent += `### Summary\n${result.summary}\n\n`;
      }

      if (result.sentiment) {
        responseContent += `### Sentiment\n${result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1)}\n\n`;
      }

      if (result.actionItems && result.actionItems.length > 0) {
        responseContent += `### Action Items\n`;
        result.actionItems.forEach((item, i) => {
          responseContent += `${i + 1}. **${item.title}** (${item.priority} priority)\n`;
        });
        responseContent += '\n';
      }

      if (result.painPoints && result.painPoints.length > 0) {
        responseContent += `### Pain Points Identified\n`;
        result.painPoints.forEach((point) => {
          responseContent += `- ${point}\n`;
        });
        responseContent += '\n';
      }

      if (result.featureRequests && result.featureRequests.length > 0) {
        responseContent += `### Feature Requests\n`;
        result.featureRequests.forEach((request) => {
          responseContent += `- ${request}\n`;
        });
      }

      addMessage('assistant', responseContent, result);
    } catch (error) {
      console.error('Processing error:', error);

      // Provide mock response for development
      const mockResponse = `## Analysis Complete

### Summary
This appears to be a ${type.replace('_', ' ')} discussing customer interactions and business processes.

### Sentiment
Neutral

### Action Items
1. **Follow up with customer** (high priority)
2. **Update internal documentation** (medium priority)

### Pain Points Identified
- Communication delays
- Process complexity

### Feature Requests
- Automated notifications
- Better tracking system

*Note: This is a mock response. Connect N8N webhook for real analysis.*`;

      addMessage('assistant', mockResponse, {
        id: `sub_${Date.now()}`,
        content,
        type,
        submittedBy: 'user@axmed.co',
        submittedAt: new Date().toISOString(),
        summary: 'Mock analysis summary',
        sentiment: 'neutral',
        actionItems: [
          { id: '1', title: 'Follow up with customer', status: 'open', priority: 'high', createdAt: new Date().toISOString() },
        ],
        painPoints: ['Communication delays', 'Process complexity'],
        featureRequests: ['Automated notifications'],
      });

      message.warning('Using mock response - N8N webhook not configured');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async (items: Array<{ content: string; type: SubmissionType }>) => {
    addMessage('user', `Bulk upload: ${items.length} items`);
    setLoading(true);

    try {
      let processed = 0;
      for (const item of items) {
        await processTranscript(item.content, item.type, 'user@axmed.co');
        processed++;
      }

      addMessage(
        'assistant',
        `## Bulk Processing Complete\n\nSuccessfully processed **${processed}** items.\n\nView the [Insights](/insights) page for aggregated analysis.`
      );

      message.success(`Processed ${processed} items`);
    } catch (error) {
      console.error('Bulk processing error:', error);
      addMessage(
        'assistant',
        `## Bulk Processing\n\nProcessed items in mock mode. Connect N8N webhook for real analysis.\n\nView the [Insights](/insights) page for aggregated analysis.`
      );
      message.warning('Using mock processing - N8N webhook not configured');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', margin: '-24px', background: '#fff' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
        <Title level={4} style={{ margin: 0 }}>Submit & Chat</Title>
      </div>

      <ChatHistory messages={messages} loading={loading} />

      <ChatInput onSubmit={handleSubmit} onBulkSubmit={handleBulkSubmit} disabled={loading} />
    </div>
  );
}

export default ChatPage;
