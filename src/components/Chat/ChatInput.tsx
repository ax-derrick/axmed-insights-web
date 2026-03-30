import { useState, useRef } from 'react';
import { Input, Button, Upload, Space, Dropdown, message, Typography } from 'antd';
import {
  SendOutlined,
  UploadOutlined,
  FileTextOutlined,
  AudioOutlined,
  CommentOutlined,
  DownOutlined,
} from '@ant-design/icons';
import type { UploadProps, MenuProps } from 'antd';
import type { SubmissionType } from '../../types';
import { parseFile, isFileSupported } from '../../utils/fileParser';

const { TextArea } = Input;
const { Text } = Typography;

interface ChatInputProps {
  onSubmit: (content: string, type: SubmissionType) => void;
  onBulkSubmit: (items: Array<{ content: string; type: SubmissionType }>) => void;
  disabled?: boolean;
}

const typeOptions: MenuProps['items'] = [
  { key: 'transcript', label: 'Call Transcript', icon: <AudioOutlined /> },
  { key: 'meeting_notes', label: 'Meeting Notes', icon: <FileTextOutlined /> },
  { key: 'feedback', label: 'Customer Feedback', icon: <CommentOutlined /> },
];

function ChatInput({ onSubmit, onBulkSubmit, disabled }: ChatInputProps) {
  const [content, setContent] = useState('');
  const [type, setType] = useState<SubmissionType>('transcript');
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content.trim(), type);
    setContent('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const uploadProps: UploadProps = {
    accept: '.xlsx,.xls,.csv',
    showUploadList: false,
    beforeUpload: async (file) => {
      if (!isFileSupported(file)) {
        message.error('Please upload an Excel (.xlsx, .xls) or CSV file');
        return false;
      }

      setUploading(true);
      try {
        const result = await parseFile(file);
        if (result.success && result.data.length > 0) {
          const items = result.data.map((row) => ({
            content: row.content,
            type: (row.type as SubmissionType) || type,
          }));
          onBulkSubmit(items);
          message.success(`Uploaded ${items.length} items from ${file.name}`);
        } else {
          message.error(result.error || 'Failed to parse file');
        }
      } catch {
        message.error('Failed to process file');
      } finally {
        setUploading(false);
      }

      return false;
    },
  };

  const typeLabel = typeOptions?.find((t) => t?.key === type);

  return (
    <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Dropdown
            menu={{
              items: typeOptions,
              onClick: ({ key }) => setType(key as SubmissionType),
              selectedKeys: [type],
            }}
          >
            <Button>
              {typeLabel && 'icon' in typeLabel ? typeLabel.icon : null}
              <span style={{ marginLeft: '4px' }}>
                {typeLabel && 'label' in typeLabel ? String(typeLabel.label) : 'Select type'}
              </span>
              <DownOutlined />
            </Button>
          </Dropdown>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />} loading={uploading}>
              Bulk Upload
            </Button>
          </Upload>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Supports .xlsx, .xls, .csv
          </Text>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <TextArea
            ref={inputRef as React.RefObject<any>}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Paste your transcript, meeting notes, or feedback here..."
            autoSize={{ minRows: 2, maxRows: 8 }}
            disabled={disabled}
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSubmit}
            disabled={!content.trim() || disabled}
            style={{ alignSelf: 'flex-end' }}
          >
            Submit
          </Button>
        </div>

        <Text type="secondary" style={{ fontSize: '11px' }}>
          Press Enter to submit, Shift+Enter for new line
        </Text>
      </Space>
    </div>
  );
}

export default ChatInput;
