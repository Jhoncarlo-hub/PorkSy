import { useCallback, useEffect, useState } from 'react';
import { deleteRow, getAllTables, insertRow, listRows, updateRow } from '../lib/dataStore';
import type { DataRow } from '../lib/types';

export function useTable(table: string) {
  const [rows, setRows] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setRows(await listRows(table));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load data');
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(() => {
    reload();
  }, [reload]);

  const create = async (values: DataRow) => {
    await insertRow(table, values);
    await reload();
  };

  const update = async (id: string | number, values: DataRow) => {
    await updateRow(table, id, values);
    await reload();
  };

  const remove = async (id: string | number) => {
    await deleteRow(table, id);
    await reload();
  };

  return { rows, loading, error, reload, create, update, remove };
}

export function useFarmSnapshot() {
  const [tables, setTables] = useState<Record<string, DataRow[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setTables(await getAllTables());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { tables, loading, error, reload };
}
