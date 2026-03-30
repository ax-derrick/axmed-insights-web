import * as XLSX from 'xlsx';

export interface ParsedRow {
  content: string;
  type?: string;
  date?: string;
  [key: string]: string | undefined;
}

export interface ParseResult {
  success: boolean;
  data: ParsedRow[];
  error?: string;
}

// Parse Excel or CSV file
export async function parseFile(file: File): Promise<ParseResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
      defval: '',
    });

    if (jsonData.length === 0) {
      return {
        success: false,
        data: [],
        error: 'File is empty or has no data rows',
      };
    }

    // Normalize the data - try to find content column
    const rows: ParsedRow[] = jsonData.map((row) => {
      const normalizedRow: ParsedRow = { content: '' };

      // Look for common content column names
      const contentKeys = ['content', 'text', 'transcript', 'feedback', 'notes', 'message'];
      for (const key of Object.keys(row)) {
        const lowerKey = key.toLowerCase();
        if (contentKeys.includes(lowerKey)) {
          normalizedRow.content = String(row[key] || '');
          break;
        }
      }

      // If no content column found, use the first column
      if (!normalizedRow.content) {
        const firstKey = Object.keys(row)[0];
        normalizedRow.content = String(row[firstKey] || '');
      }

      // Try to find type column
      const typeKeys = ['type', 'category'];
      for (const key of Object.keys(row)) {
        const lowerKey = key.toLowerCase();
        if (typeKeys.includes(lowerKey)) {
          normalizedRow.type = String(row[key] || '');
          break;
        }
      }

      // Try to find date column
      const dateKeys = ['date', 'timestamp', 'created', 'submitted'];
      for (const key of Object.keys(row)) {
        const lowerKey = key.toLowerCase();
        if (dateKeys.includes(lowerKey)) {
          normalizedRow.date = String(row[key] || '');
          break;
        }
      }

      return normalizedRow;
    });

    // Filter out rows with empty content
    const validRows = rows.filter((row) => row.content.trim().length > 0);

    return {
      success: true,
      data: validRows,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Failed to parse file',
    };
  }
}

// Get supported file extensions
export function getSupportedExtensions(): string[] {
  return ['.xlsx', '.xls', '.csv'];
}

// Check if file type is supported
export function isFileSupported(file: File): boolean {
  const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
  return getSupportedExtensions().includes(extension);
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
