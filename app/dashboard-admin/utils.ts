export function paginate<T>(rows: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}

export function getTotalPages(totalRows: number, pageSize: number) {
  return Math.max(1, Math.ceil(totalRows / pageSize));
}

export function clampPage(current: number, total: number) {
  if (current < 1) return 1;
  if (current > total) return total;
  return current;
}

export function formatDateTime(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}
