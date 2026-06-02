export const peso = (value: unknown) => `PHP ${Number(value || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const kg = (value: unknown) => `${Number(value || 0).toLocaleString('en-PH', { maximumFractionDigits: 2 })} kg`;

export const pretty = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '-';
  return String(value).replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

export const today = () => new Date().toISOString().slice(0, 10);

export const dateLabel = (value: unknown) => {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-PH', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(String(value)));
};

export const ageDays = (dob?: string | null) => {
  if (!dob) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(dob).getTime()) / 86400000));
};
