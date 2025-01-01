import { saveAs } from 'file-saver';

export const downloadCSV = (jsonList: any[], fileName: string) => {
  if (!jsonList || jsonList.length === 0) return '';

  const headers = Object.keys(jsonList[0]);
  const rows = jsonList.map((row) => headers.map((header) => `"${row[header] || ''}"`).join(','));

  const csv = [headers.join(','), ...rows].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, fileName);
};
