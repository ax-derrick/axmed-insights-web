import { useState, useEffect, useCallback } from 'react';
import { Row, Col, Typography, DatePicker, Button, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { SentimentTrend, WordCloud, TranscriptList } from '../components/Insights';
import {
  getSentimentTrend,
  getKeywordsCloud,
  getFeatureRequests,
  getCompetitors,
  getTopPainPoints,
  getTranscripts,
  type DateRange,
} from '../services/n8n';
import type { PainPoint, SentimentDataPoint, KeywordItem, FeatureRequest, CompetitorItem, Transcript } from '../types';
import type { Dayjs } from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

function InsightsPage() {
  const [trendData, setTrendData] = useState<SentimentDataPoint[]>([]);
  const [keywords, setKeywords] = useState<KeywordItem[]>([]);
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorItem[]>([]);
  const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [transcriptsLoading, setTranscriptsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({});

  const fetchData = useCallback(async (range: DateRange = dateRange) => {
    setLoading(true);
    try {
      const [trendDataResult, keywordsData, featuresData, competitorsData, painPointsData] = await Promise.all([
        getSentimentTrend(range),
        getKeywordsCloud(range),
        getFeatureRequests(range),
        getCompetitors(range),
        getTopPainPoints(range),
      ]);
      setTrendData(Array.isArray(trendDataResult) ? trendDataResult : [trendDataResult]);
      setKeywords(keywordsData);
      setFeatureRequests(featuresData);
      setCompetitors(competitorsData);
      setPainPoints(painPointsData);
    } catch (error) {
      console.error('Error fetching insights data:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  const fetchTranscripts = useCallback(async (range: DateRange = dateRange, search: string = transcriptSearch) => {
    setTranscriptsLoading(true);
    try {
      const data = await getTranscripts(range, search || undefined);
      setTranscripts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching transcripts:', error);
      setTranscripts([]);
    } finally {
      setTranscriptsLoading(false);
    }
  }, [dateRange, transcriptSearch]);

  useEffect(() => {
    fetchData();
    fetchTranscripts();
  }, [fetchData, fetchTranscripts]);

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    const newRange: DateRange = dates && dates[0] && dates[1]
      ? { startDate: dates[0].format('YYYY-MM-DD'), endDate: dates[1].format('YYYY-MM-DD') }
      : {};
    setDateRange(newRange);
    fetchData(newRange);
    fetchTranscripts(newRange, transcriptSearch);
  };

  const handleTranscriptSearch = (search: string) => {
    setTranscriptSearch(search);
    fetchTranscripts(dateRange, search);
  };

  // Transform data for charts - pass raw date string, let component format it
  const trendDataForChart = trendData.map(d => ({
    date: d.period || '',
    positive: parseInt(d.positive) || 0,
    neutral: parseInt(d.neutral) || 0,
    negative: parseInt(d.negative) || 0,
  }));

  const keywordsForDisplay = keywords.slice(0, 15).map(k => ({
    text: k.keyword,
    count: parseInt(k.count) || 0,
  }));

  const painPointsForDisplay = painPoints.slice(0, 10).map(p => ({
    text: p.pain_point,
    count: parseInt(p.count) || 0,
  }));

  const featureRequestsForDisplay = featureRequests.slice(0, 10).map(f => ({
    text: f.title,
    count: parseInt(f.sourceCount) || 0,
  }));

  const competitorsForDisplay = competitors.slice(0, 8).map(c => ({
    text: c.competitor,
    count: parseInt(c.mentions) || 0,
  }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Insights & Analytics</Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>Deep dive into customer feedback patterns</Text>
        </div>
        <Space wrap>
          <RangePicker
            onChange={handleDateRangeChange}
            allowClear
            placeholder={['Start Date', 'End Date']}
            size="middle"
          />
          <Button icon={<ReloadOutlined />} onClick={() => fetchData()} loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>

      {/* Sentiment Trend - Full Width */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24}>
          <SentimentTrend data={trendDataForChart} loading={loading} />
        </Col>
      </Row>

      {/* Topic Analysis */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <WordCloud
            items={keywordsForDisplay}
            loading={loading}
            title="Top Keywords"
            color="#1890ff"
          />
        </Col>
        <Col xs={24} lg={12}>
          <WordCloud
            items={painPointsForDisplay}
            loading={loading}
            title="Pain Points"
            color="#ff4d4f"
          />
        </Col>
      </Row>

      {/* Feature Requests & Competitors */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <WordCloud
            items={featureRequestsForDisplay}
            loading={loading}
            title="Feature Requests"
            color="#722ed1"
          />
        </Col>
        <Col xs={24} lg={12}>
          <WordCloud
            items={competitorsForDisplay}
            loading={loading}
            title="Competitors Mentioned"
            color="#faad14"
          />
        </Col>
      </Row>

      {/* Transcripts List */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <TranscriptList
            transcripts={transcripts}
            loading={transcriptsLoading}
            searchText={transcriptSearch}
            onSearchChange={handleTranscriptSearch}
          />
        </Col>
      </Row>
    </div>
  );
}

export default InsightsPage;
