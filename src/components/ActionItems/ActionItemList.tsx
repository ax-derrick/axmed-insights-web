import { List } from 'antd';
import ActionItemCard from './ActionItemCard';
import { EmptyState } from '../common';
import type { ActionItem } from '../../types';
import { CheckSquareOutlined } from '@ant-design/icons';

interface ActionItemListProps {
  items: ActionItem[];
  loading?: boolean;
  onStatusChange: (id: string, status: ActionItem['status']) => void;
}

function ActionItemList({ items, loading, onStatusChange }: ActionItemListProps) {
  if (items.length === 0 && !loading) {
    return (
      <EmptyState
        icon={<CheckSquareOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />}
        title="No action items"
        description="Action items will appear here when extracted from submissions"
      />
    );
  }

  return (
    <List
      loading={loading}
      dataSource={items}
      renderItem={(item) => (
        <ActionItemCard
          key={item.id}
          item={item}
          onStatusChange={onStatusChange}
        />
      )}
    />
  );
}

export default ActionItemList;
