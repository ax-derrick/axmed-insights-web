import { List } from 'antd';
import FeatureCard from './FeatureCard';
import { EmptyState } from '../common';
import type { FeatureRequest } from '../../types';
import { BulbOutlined } from '@ant-design/icons';

interface FeatureListProps {
  items: FeatureRequest[];
  loading?: boolean;
}

function FeatureList({ items, loading }: FeatureListProps) {
  if (items.length === 0 && !loading) {
    return (
      <EmptyState
        icon={<BulbOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />}
        title="No feature requests"
        description="Feature requests will appear here when extracted from customer feedback"
      />
    );
  }

  return (
    <List
      loading={loading}
      dataSource={items}
      renderItem={(item, index) => (
        <FeatureCard key={index} feature={item} />
      )}
    />
  );
}

export default FeatureList;
