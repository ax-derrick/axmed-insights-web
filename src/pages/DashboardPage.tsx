import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Button, DatePicker, Space } from 'antd';
import { ReloadOutlined, FileTextOutlined, CheckSquareOutlined, ClockCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { StatCard, SentimentGauge, UrgencyChart, ResolutionRate, ResolutionTime, ActivityFeed, PainPointsList, SectionHeader, NeedsAttention, QuickViewDrawer, MetricRow, MetricSection } from '../components/Dashboard';
import type { NeedsAttentionItem } from '../components/Dashboard';
import { Progress } from 'antd';
import { getDashboardSummary, getTopPainPoints, getRecentActivity, getUrgencyDistribution, getResolutionStats, getResolutionTime, type DateRange } from '../services/n8n';
import type { DashboardSummary, PainPoint, ActivityItem, UrgencyData, ResolutionStats, ResolutionTimeStats } from '../types';
import type { Dayjs } from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

function DashboardPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [urgencyData, setUrgencyData] = useState<UrgencyData>({ high: 0, medium: 0, low: 0 });
  const [resolutionStats, setResolutionStats] = useState<ResolutionStats>({ completed: 0, inProgress: 0, newRequests: 0, total: 0 });
  const [resolutionTime, setResolutionTime] = useState<ResolutionTimeStats>({ avgDays: 0, minDays: 0, maxDays: 0, totalResolved: 0 });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({});
  const intervalRef = useRef<number | null>(null);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState<'sentiment' | 'resolution' | null>(null);

  const fetchData = useCallback(async (range: DateRange = dateRange) => {
    setLoading(true);
    try {
      const [summaryData, painPointsData, activityData, urgency, resolution, resTime] = await Promise.all([
        getDashboardSummary(range),
        getTopPainPoints(range),
        getRecentActivity(range),
        getUrgencyDistribution(range),
        getResolutionStats(range),
        getResolutionTime(range),
      ]);
      setSummary(summaryData);
      setPainPoints(painPointsData);
      setActivity(activityData);
      setUrgencyData(urgency);
      setResolutionStats(resolution);
      setResolutionTime(resTime);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchData();
    intervalRef.current = window.setInterval(() => fetchData(), AUTO_REFRESH_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData]);

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    const newRange: DateRange = dates && dates[0] && dates[1]
      ? { startDate: dates[0].format('YYYY-MM-DD'), endDate: dates[1].format('YYYY-MM-DD') }
      : {};
    setDateRange(newRange);
    fetchData(newRange);
  };

  // Calculate sentiment breakdown
  const sentimentBreakdown = summary ? {
    positive: parseInt(summary.positive) || 0,
    neutral: parseInt(summary.neutral) || 0,
    negative: parseInt(summary.negative) || 0,
  } : { positive: 0, neutral: 0, negative: 0 };

  // Transform pain points
  const painPointsForDisplay = painPoints.slice(0, 5).map(p => ({
    text: p.pain_point,
    count: parseInt(p.count) || 0,
  }));

  // Calculate trends
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return null;
    const percentChange = Math.round(((current - previous) / previous) * 100);
    return { value: Math.abs(percentChange), isPositive: percentChange >= 0 };
  };

  const weeklySubmissions = summary ? parseInt(summary.weekly_submissions) || 0 : 0;
  const lastWeekSubmissions = summary?.last_week_submissions ? parseInt(summary.last_week_submissions) || 0 : 0;
  const submissionsTrend = calculateTrend(weeklySubmissions, lastWeekSubmissions);

  const openActions = summary ? parseInt(summary.open_actions) || 0 : 0;
  const lastWeekOpenActions = summary?.last_week_open_actions ? parseInt(summary.last_week_open_actions) || 0 : 0;
  const openActionsTrend = calculateTrend(openActions, lastWeekOpenActions);
  const actionItemsTrendDisplay = openActionsTrend ? {
    value: openActionsTrend.value,
    isPositive: !openActionsTrend.isPositive,
  } : undefined;

  // Calculate urgent items count
  const urgentCount = urgencyData.high;

  // Determine status based on metrics
  const getOpenActionsStatus = () => {
    if (openActions === 0) return 'good' as const;
    if (urgentCount >= 3) return 'critical' as const;
    if (openActions > 10) return 'warning' as const;
    return 'neutral' as const;
  };

  const getResolutionStatus = () => {
    if (resolutionTime.avgDays <= 2) return 'good' as const;
    if (resolutionTime.avgDays <= 5) return 'neutral' as const;
    if (resolutionTime.avgDays <= 7) return 'warning' as const;
    return 'critical' as const;
  };

  // Transform activity items into NeedsAttention items
  // Prioritize negative sentiment and action items
  const needsAttentionItems: NeedsAttentionItem[] = activity
    .map((item) => {
      // Determine urgency based on sentiment and type
      let urgency: 'urgent' | 'high' | 'new' = 'new';
      if (item.sentiment?.toLowerCase() === 'negative') {
        urgency = 'urgent';
      } else if (item.type === 'action_item') {
        urgency = 'high';
      }

      return {
        id: item.id,
        type: item.type as 'action_item' | 'submission' | 'feature_request',
        title: item.title,
        urgency,
        timestamp: item.timestamp,
        source: item.summary ? item.summary.slice(0, 30) + (item.summary.length > 30 ? '...' : '') : undefined,
      };
    })
    // Sort: urgent first, then high, then new
    .sort((a, b) => {
      const order = { urgent: 0, high: 1, new: 2 };
      return order[a.urgency] - order[b.urgency];
    });

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Dashboard</Title>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            Customer feedback health at a glance
          </Typography.Text>
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

      {/* Key Metrics Section */}
      <SectionHeader
        title="How are we doing?"
        subtitle="Key performance indicators"
      />
      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Submissions"
            value={summary ? parseInt(summary.total_submissions) || 0 : 0}
            prefix={<FileTextOutlined />}
            loading={loading}
            onClick={() => navigate('/insights')}
            tooltip="Total feedback submissions received. Click to view insights."
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="This Week"
            value={weeklySubmissions}
            prefix={<FileTextOutlined />}
            trend={submissionsTrend || undefined}
            comparison={`avg: ${lastWeekSubmissions}/week`}
            loading={loading}
            onClick={() => navigate('/insights')}
            tooltip={
              <div>
                <div><strong>Submissions this week:</strong> {weeklySubmissions}</div>
                <div>Last week: {lastWeekSubmissions}</div>
                <div style={{ marginTop: 4, fontSize: 11, opacity: 0.8 }}>Click to view all submissions</div>
              </div>
            }
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Open Actions"
            value={openActions}
            prefix={urgentCount > 0 ? <WarningOutlined /> : <CheckSquareOutlined />}
            trend={actionItemsTrendDisplay}
            comparison={urgentCount > 0 ? `${urgentCount} urgent` : undefined}
            status={getOpenActionsStatus()}
            loading={loading}
            onClick={() => navigate('/action-items')}
            tooltip={
              <div>
                <div><strong>Open action items:</strong> {openActions}</div>
                <div>High priority: {urgencyData.high}</div>
                <div>Medium: {urgencyData.medium}</div>
                <div>Low: {urgencyData.low}</div>
                <div style={{ marginTop: 4, fontSize: 11, opacity: 0.8 }}>Click to manage action items</div>
              </div>
            }
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Avg Resolution"
            value={`${resolutionTime.avgDays.toFixed(1)}d`}
            prefix={<ClockCircleOutlined />}
            target="3d"
            status={getResolutionStatus()}
            loading={loading}
            onClick={() => navigate('/action-items')}
            tooltip={
              <div>
                <div><strong>Average resolution time:</strong> {resolutionTime.avgDays.toFixed(1)} days</div>
                <div>Fastest: {resolutionTime.minDays.toFixed(1)}d</div>
                <div>Slowest: {resolutionTime.maxDays.toFixed(1)}d</div>
                <div>Total resolved: {resolutionTime.totalResolved}</div>
                <div style={{ marginTop: 4, fontSize: 11, opacity: 0.8 }}>Target: 3 days or less</div>
              </div>
            }
          />
        </Col>
      </Row>

      {/* Analysis Section */}
      <SectionHeader
        title="What's happening?"
        subtitle="Sentiment and resolution analysis"
      />
      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <div onClick={() => setDrawerOpen('sentiment')} style={{ cursor: 'pointer' }}>
            <SentimentGauge data={sentimentBreakdown} loading={loading} />
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <UrgencyChart data={urgencyData} loading={loading} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div onClick={() => setDrawerOpen('resolution')} style={{ cursor: 'pointer' }}>
            <ResolutionRate data={resolutionStats} loading={loading} />
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <ResolutionTime data={resolutionTime} loading={loading} />
        </Col>
      </Row>

      {/* Details Section */}
      <SectionHeader
        title="What needs attention?"
        subtitle="Top issues and recent activity"
      />
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <PainPointsList
            items={painPointsForDisplay}
            loading={loading}
            maxItems={3}
            total={painPoints.length}
            onViewAll={() => navigate('/insights')}
          />
        </Col>
        <Col xs={24} lg={12}>
          <NeedsAttention
            items={needsAttentionItems}
            loading={loading}
            maxItems={4}
            total={activity.length}
            onViewAll={() => navigate('/action-items')}
            onItemClick={(item) => {
              if (item.type === 'action_item') {
                navigate('/action-items');
              } else {
                navigate('/insights');
              }
            }}
          />
        </Col>
      </Row>

      {/* Sentiment Quick View Drawer */}
      <QuickViewDrawer
        open={drawerOpen === 'sentiment'}
        onClose={() => setDrawerOpen(null)}
        title="Sentiment Analysis"
        subtitle="Breakdown of customer feedback sentiment"
        onViewDetails={() => {
          setDrawerOpen(null);
          navigate('/insights');
        }}
        viewDetailsLabel="View Full Insights"
      >
        <MetricSection title="Overall Score">
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 48, fontWeight: 600, color: '#1890ff' }}>
              {sentimentBreakdown.positive + sentimentBreakdown.neutral + sentimentBreakdown.negative > 0
                ? Math.round(
                    ((sentimentBreakdown.positive * 100 + sentimentBreakdown.neutral * 50) /
                      (sentimentBreakdown.positive + sentimentBreakdown.neutral + sentimentBreakdown.negative))
                  )
                : 50}
            </div>
            <div style={{ color: '#888', fontSize: 14 }}>out of 100</div>
          </div>
        </MetricSection>

        <MetricSection title="Sentiment Breakdown">
          <MetricRow
            label="Positive"
            value={`${sentimentBreakdown.positive} (${Math.round((sentimentBreakdown.positive / (sentimentBreakdown.positive + sentimentBreakdown.neutral + sentimentBreakdown.negative || 1)) * 100)}%)`}
            color="#1890ff"
          />
          <Progress
            percent={Math.round((sentimentBreakdown.positive / (sentimentBreakdown.positive + sentimentBreakdown.neutral + sentimentBreakdown.negative || 1)) * 100)}
            strokeColor="#1890ff"
            showInfo={false}
            size="small"
          />

          <MetricRow
            label="Neutral"
            value={`${sentimentBreakdown.neutral} (${Math.round((sentimentBreakdown.neutral / (sentimentBreakdown.positive + sentimentBreakdown.neutral + sentimentBreakdown.negative || 1)) * 100)}%)`}
            color="#faad14"
          />
          <Progress
            percent={Math.round((sentimentBreakdown.neutral / (sentimentBreakdown.positive + sentimentBreakdown.neutral + sentimentBreakdown.negative || 1)) * 100)}
            strokeColor="#faad14"
            showInfo={false}
            size="small"
          />

          <MetricRow
            label="Negative"
            value={`${sentimentBreakdown.negative} (${Math.round((sentimentBreakdown.negative / (sentimentBreakdown.positive + sentimentBreakdown.neutral + sentimentBreakdown.negative || 1)) * 100)}%)`}
            color="#ff4d4f"
          />
          <Progress
            percent={Math.round((sentimentBreakdown.negative / (sentimentBreakdown.positive + sentimentBreakdown.neutral + sentimentBreakdown.negative || 1)) * 100)}
            strokeColor="#ff4d4f"
            showInfo={false}
            size="small"
          />
        </MetricSection>

        <MetricSection title="Summary">
          <Typography.Text type="secondary">
            Based on {sentimentBreakdown.positive + sentimentBreakdown.neutral + sentimentBreakdown.negative} total submissions
            in the selected period.
          </Typography.Text>
        </MetricSection>
      </QuickViewDrawer>

      {/* Resolution Quick View Drawer */}
      <QuickViewDrawer
        open={drawerOpen === 'resolution'}
        onClose={() => setDrawerOpen(null)}
        title="Resolution Status"
        subtitle="Action item completion breakdown"
        onViewDetails={() => {
          setDrawerOpen(null);
          navigate('/action-items');
        }}
        viewDetailsLabel="View All Action Items"
      >
        <MetricSection title="Completion Rate">
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 48, fontWeight: 600, color: '#1890ff' }}>
              {resolutionStats.total > 0
                ? Math.round((resolutionStats.completed / resolutionStats.total) * 100)
                : 0}%
            </div>
            <div style={{ color: '#888', fontSize: 14 }}>
              {resolutionStats.completed} of {resolutionStats.total} resolved
            </div>
          </div>
        </MetricSection>

        <MetricSection title="Status Breakdown">
          <MetricRow label="Completed" value={resolutionStats.completed} color="#52c41a" />
          <MetricRow label="In Progress" value={resolutionStats.inProgress} color="#1890ff" />
          <MetricRow label="New Requests" value={resolutionStats.newRequests} color="#d9d9d9" />
        </MetricSection>

        <MetricSection title="Resolution Time">
          <MetricRow label="Average" value={`${resolutionTime.avgDays.toFixed(1)} days`} />
          <MetricRow label="Fastest" value={`${resolutionTime.minDays.toFixed(1)} days`} color="#52c41a" />
          <MetricRow label="Slowest" value={`${resolutionTime.maxDays.toFixed(1)} days`} color="#ff4d4f" />
        </MetricSection>
      </QuickViewDrawer>
    </div>
  );
}

export default DashboardPage;
