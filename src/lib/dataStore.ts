import { supabase } from './supabase';
import { mockTables } from './mockData';
import type { DataRow } from './types';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

let memoryTables = clone(mockTables);

export const resetDemoData = () => {
  memoryTables = clone(mockTables);
};

export const listRows = async (table: string) => {
  if (supabase) {
    const { data, error } = await supabase.from(table).select('*').order('id', { ascending: false });
    if (error) throw error;
    return (data ?? []) as DataRow[];
  }
  return [...(memoryTables[table] ?? [])].reverse();
};

export const insertRow = async (table: string, values: DataRow) => {
  if (supabase) {
    const { data, error } = await supabase.from(table).insert(values).select().single();
    if (error) throw error;
    return data as DataRow;
  }
  const rows = memoryTables[table] ?? [];
  const nextId = rows.reduce((max, row) => Math.max(max, Number(row.id ?? 0)), 0) + 1;
  const row = { id: nextId, ...values };
  memoryTables[table] = [...rows, row];
  return row;
};

export const updateRow = async (table: string, id: string | number, values: DataRow) => {
  if (supabase) {
    const { data, error } = await supabase.from(table).update(values).eq('id', id).select().single();
    if (error) throw error;
    return data as DataRow;
  }
  memoryTables[table] = (memoryTables[table] ?? []).map((row) => String(row.id) === String(id) ? { ...row, ...values } : row);
  return memoryTables[table].find((row) => String(row.id) === String(id)) ?? null;
};

export const deleteRow = async (table: string, id: string | number) => {
  if (supabase) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    return;
  }
  memoryTables[table] = (memoryTables[table] ?? []).filter((row) => String(row.id) !== String(id));
};

export const getAllTables = async () => {
  const tables = ['profiles', 'pig_breeds', 'pens', 'pigs', 'feed_types', 'feed_inventory', 'feeding_records', 'weight_records', 'health_records', 'breeding_records', 'mortality_records', 'sales_records', 'expenses', 'tasks'];
  const pairs = await Promise.all(tables.map(async (table) => [table, await listRows(table)] as const));
  return Object.fromEntries(pairs) as Record<string, DataRow[]>;
};
