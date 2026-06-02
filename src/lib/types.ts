export type Role = 'admin' | 'staff' | 'vet';
export type Status = 'active' | 'inactive' | 'sold' | 'deceased' | 'transferred' | 'pending' | 'completed' | 'overdue' | 'cancelled' | 'paid' | 'partial';

export type Profile = {
  id: string;
  username: string;
  full_name: string;
  role: Role;
  email?: string | null;
  contact?: string | null;
  status: 'active' | 'inactive';
};

export type DataRow = Record<string, string | number | boolean | null | undefined>;

export type Field = {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'email';
  required?: boolean;
  options?: string[];
  readOnly?: boolean;
  placeholder?: string;
};

export type ModuleConfig = {
  key: string;
  title: string;
  table: string;
  roles: Role[];
  icon: string;
  description: string;
  fields: Field[];
  columns: string[];
  searchKeys: string[];
  defaultValues?: DataRow;
  softDelete?: { field: string; value: string };
};
