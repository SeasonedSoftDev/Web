export const convertToCSV = (data: any[]): string => {
  const header = Object.keys(data[0]).join(',');
  const rows = data.map((obj) => Object.values(obj).join(','));
  return `${header}\n${rows.join('\n')}`;
};

export const downloadCSV = (content: string, fileName: string): void => {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};
