import { useState, useEffect, useCallback } from 'react';
import { Typography, Select, Space, Button, Row, Col, Card, Statistic, Input, DatePicker } from 'antd';
import { ReloadOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { ActionItemList } from '../components/ActionItems';
import { getActionItems, type DateRange } from '../services/n8n';
import type { ActionItem, ActionItemStatus, ActionItemPriority } from '../types';
import type { Dayjs } from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

type SortOption = 'newest' | 'oldest' | 'priority_high' | 'priority_low';

const priorityOrder: Record<ActionItemPriority, number> = {
  urgent: 4,
  high: 3,
  'High priority': 3,
  medium: 2,
  'Medium priority': 2,
  low: 1,
  'Low priority': 1,
};

// Helper to normalize status values from API
function normalizeStatus(status: string | null | undefined): ActionItemStatus {
  if (!status) return 'open';
  const lower = status.toLowerCase().replace(/\s+/g, '_');
  if (lower === 'new_requests' || lower === 'open') return 'open';
  if (lower === 'in_progress') return 'in_progress';
  if (lower === 'completed' || lower === 'done') return 'completed';
  return 'open';
}

// Helper to normalize priority values from API
function normalizePriority(priority: string | null | undefined): ActionItemPriority {
  if (!priority) return 'medium';
  const lower = priority.toLowerCase();
  if (lower.includes('urgent')) return 'urgent';
  if (lower.includes('high')) return 'high';
  if (lower.includes('medium')) return 'medium';
  if (lower.includes('low')) return 'low';
  return 'medium';
}

function ActionItemsPage() {
  const [items, setItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ActionItemStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<ActionItemPriority | 'all'>('all');
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [dateRange, setDateRange] = useState<DateRange>({});

  const fetchData = useCallback(async (range: DateRange = dateRange) => {
    setLoading(true);
    try {
      const response = await getActionItems(range);
      // Normalize the data - handle both array and single object
      const itemsArray = Array.isArray(response) ? response : [response];
      const normalizedItems = itemsArray.map(item => ({
        ...item,
        status: normalizeStatus(item.status),
        priority: normalizePriority(item.priority),
      }));
      setItems(normalizedItems);
    } catch (error) {
      console.error('Error fetching action items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    const newRange: DateRange = dates && dates[0] && dates[1]
      ? {
          startDate: dates[0].format('YYYY-MM-DD'),
          endDate: dates[1].format('YYYY-MM-DD'),
        }
      : {};
    setDateRange(newRange);
    fetchData(newRange);
  };

  const handleStatusChange = async (id: string, newStatus: ActionItemStatus) => {
    // Update local state optimistically
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: newStatus }
          : item
      )
    );
  };

  // Filter items based on selected filters and search
  const filteredItems = items
    .filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
      if (searchText) {
        const search = searchText.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(search);
        const matchesDescription = item.description?.toLowerCase().includes(search);
        const matchesAssignee = item.assignee?.toLowerCase().includes(search);
        if (!matchesTitle && !matchesDescription && !matchesAssignee) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'oldest':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'priority_high':
          return priorityOrder[b.priority || 'medium'] - priorityOrder[a.priority || 'medium'];
        case 'priority_low':
          return priorityOrder[a.priority || 'medium'] - priorityOrder[b.priority || 'medium'];
        default:
          return 0;
      }
    });

  // Calculate stats
  const openCount = items.filter((i) => i.status === 'open').length;
  const inProgressCount = items.filter((i) => i.status === 'in_progress').length;
  const completedCount = items.filter((i) => i.status === 'completed').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <Title level={4} style={{ margin: 0 }}>Action Items</Title>
        <Space wrap>
          <RangePicker
            onChange={handleDateRangeChange}
            allowClear
            placeholder={['Start Date', 'End Date']}
          />
          <Button icon={<ReloadOutlined />} onClick={() => fetchData()} loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>

      {/* Filters Row */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Input
          placeholder="Search by title, description, or assignee..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 280 }}
          allowClear
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 140 }}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'open', label: 'Open' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
          ]}
        />
        <Select
          value={priorityFilter}
          onChange={setPriorityFilter}
          style={{ width: 140 }}
          options={[
            { value: 'all', label: 'All Priority' },
            { value: 'urgent', label: 'Urgent' },
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Medium' },
            { value: 'low', label: 'Low' },
          ]}
        />
        <Select
          value={sortBy}
          onChange={setSortBy}
          style={{ width: 150 }}
          options={[
            { value: 'newest', label: 'Newest First' },
            { value: 'oldest', label: 'Oldest First' },
            { value: 'priority_high', label: 'Priority: High' },
            { value: 'priority_low', label: 'Priority: Low' },
          ]}
        />
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Open"
              value={openCount}
              prefix={<ExclamationCircleOutlined style={{ color: '#faad14' }} />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="In Progress"
              value={inProgressCount}
              prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Completed"
              value={completedCount}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* Action Items List */}
      <ActionItemList
        items={filteredItems}
        loading={loading}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

export default ActionItemsPage;
