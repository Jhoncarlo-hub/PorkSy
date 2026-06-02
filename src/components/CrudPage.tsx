import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Edit2, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import type { DataRow, Field, ModuleConfig } from '../lib/types';
import { pretty } from '../lib/format';
import { useTable } from '../hooks/useFarmData';

const emptyForm = (config: ModuleConfig) => Object.fromEntries(config.fields.map((field) => [field.key, config.defaultValues?.[field.key] ?? '']));

function clean(values: DataRow, fields: Field[]) {
  const out: DataRow = {};
  fields.forEach((field) => {
    const value = values[field.key];
    if (value === '') {
      out[field.key] = null;
    } else if (field.type === 'number') {
      out[field.key] = Number(value);
    } else {
      out[field.key] = value;
    }
  });
  return out;
}

function valueLabel(value: unknown) {
  if (typeof value === 'number') return value.toLocaleString('en-PH');
  return pretty(value);
}

export function CrudPage({ config }: { config: ModuleConfig }) {
  const { rows, loading, error, create, update, remove, reload } = useTable(config.table);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<DataRow | null>(null);
  const [form, setForm] = useState<DataRow>(emptyForm(config));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => config.searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(q)));
  }, [rows, query, config.searchKeys]);

  const startAdd = () => {
    setEditing(null);
    setForm(emptyForm(config));
  };

  const startEdit = (row: DataRow) => {
    setEditing(row);
    setForm({ ...emptyForm(config), ...row });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = clean(form, config.fields);
      if (editing?.id !== undefined) {
        await update(editing.id as string | number, payload);
        setMessage('Record updated.');
      } else {
        await create(payload);
        setMessage('Record added.');
      }
      startAdd();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to save record.');
    } finally {
      setSaving(false);
    }
  };

  const removeRecord = async (row: DataRow) => {
    if (!row.id) return;
    if (!confirm('Remove this record?')) return;
    if (config.softDelete) {
      await update(row.id as string | number, { [config.softDelete.field]: config.softDelete.value });
    } else {
      await remove(row.id as string | number);
    }
  };

  return (
    <section className="page-grid">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Module</p>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
        </div>
        <button className="primary-action" onClick={startAdd}><Plus size={17} /> New</button>
      </div>

      <div className="panel form-panel">
        <div className="panel-title">
          <strong>{editing ? 'Edit record' : 'New record'}</strong>
          {editing && <button className="icon-button" onClick={startAdd} aria-label="Cancel edit"><X size={18} /></button>}
        </div>
        <form className="record-form" onSubmit={submit}>
          {config.fields.map((field) => (
            <label key={field.key} className={field.type === 'textarea' ? 'span-2' : ''}>
              <span>{field.label}{field.required ? ' *' : ''}</span>
              {field.type === 'select' ? (
                <select required={field.required} value={String(form[field.key] ?? '')} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}>
                  <option value="">Select</option>
                  {field.options?.map((option) => <option key={option} value={option}>{pretty(option)}</option>)}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea rows={3} value={String(form[field.key] ?? '')} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} />
              ) : (
                <input
                  required={field.required}
                  type={field.type ?? 'text'}
                  step={field.type === 'number' ? '0.01' : undefined}
                  value={String(form[field.key] ?? '')}
                  placeholder={field.placeholder}
                  onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                />
              )}
            </label>
          ))}
          <div className="form-actions span-2">
            <button type="button" className="secondary-action" onClick={startAdd}>Clear</button>
            <button className="primary-action" disabled={saving}>{saving ? 'Saving...' : 'Save record'}</button>
          </div>
          {message && <p className="form-message span-2">{message}</p>}
        </form>
      </div>

      <div className="panel table-panel">
        <div className="table-toolbar">
          <div className="module-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${config.title.toLowerCase()}`} /></div>
          <button className="secondary-action" onClick={reload}><RefreshCw size={16} /> Refresh</button>
        </div>
        {error && <div className="alert">{error}</div>}
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {config.columns.map((column) => <th key={column}>{pretty(column)}</th>)}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={config.columns.length + 1}>Loading...</td></tr>}
              {!loading && filtered.map((row) => (
                <tr key={String(row.id)}>
                  {config.columns.map((column) => <td key={column}>{valueLabel(row[column])}</td>)}
                  <td className="row-actions">
                    <button className="icon-button" onClick={() => startEdit(row)} aria-label="Edit"><Edit2 size={16} /></button>
                    <button className="icon-button danger" onClick={() => removeRecord(row)} aria-label="Remove"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {!loading && !filtered.length && <tr><td colSpan={config.columns.length + 1}>No records found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
