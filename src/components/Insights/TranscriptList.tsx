import { Card, List, Typography, Tag, Input, Empty, Spin } from 'antd';
import { SearchOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import type { Transcript } from '../../types';

const { Text, Paragraph } = Typography;

interface TranscriptListProps {
  transcripts: Transcript[];
  loading?: boolean;
  searchText: string;
  onSearchChange: (value: string) => void;
}

function TranscriptList({ transcripts, loading, searchText, onSearchChange }: TranscriptListProps) {
  const getSentimentColor = (sentiment?: string) => {
    if (!sentiment) return 'default';
    const lower = sentiment.toLowerCase();
    if (lower.includes('positive')) return 'green';
    if (lower.includes('negative')) return 'red';
    return 'gold';
  };

  const getUrgencyColor = (urgency?: string) => {
    if (!urgency) return 'default';
    const lower = urgency.toLowerCase();
    if (lower.includes('high')) return 'red';
    if (lower.includes('medium')) return 'orange';
    return 'blue';
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getParticipantsList = (participants?: string) => {
    if (!participants) return [];
    return participants.split('\n').filter(p => p.trim());
  };

  return (
    <Card
      title="Recent Transcripts"
      size="small"
      extra={
        <Input
          placeholder="Search transcripts..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 200 }}
          allowClear
        />
      }
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin />
        </div>
      ) : transcripts.length === 0 ? (
        <Empty description="No transcripts found" />
      ) : (
        <List
          dataSource={transcripts}
          renderItem={(item) => (
            <List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarOutlined style={{ color: '#888' }} />
                    <Text strong>{formatDate(item.call_date)}</Text>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {item.ai_sentiments && (
                      <Tag color={getSentimentColor(item.ai_sentiments)} style={{ margin: 0 }}>
                        {item.ai_sentiments}
                      </Tag>
                    )}
                    {item.ai_urgency && (
                      <Tag color={getUrgencyColor(item.ai_urgency)} style={{ margin: 0 }}>
                        {item.ai_urgency}
                      </Tag>
                    )}
                  </div>
                </div>

                {item.participants && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                    <UserOutlined style={{ color: '#888', fontSize: '12px' }} />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {getParticipantsList(item.participants).slice(0, 3).join(', ')}
                      {getParticipantsList(item.participants).length > 3 && ` +${getParticipantsList(item.participants).length - 3} more`}
                    </Text>
                  </div>
                )}

                {item.ai_summary && (
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{ margin: 0, color: '#555', fontSize: '13px' }}
                  >
                    {item.ai_summary}
                  </Paragraph>
                )}

                {item.ai_pain_points && (
                  <div style={{ marginTop: '8px' }}>
                    {item.ai_pain_points.split('\n').slice(0, 2).map((point, idx) => (
                      <Tag key={idx} color="red-inverse" style={{ fontSize: '11px', marginBottom: '4px' }}>
                        {point.trim().substring(0, 40)}{point.length > 40 ? '...' : ''}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
}

export default TranscriptList;
