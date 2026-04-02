import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import './TransactionModal.css';

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const makeId = () => `txn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const blank = {
  desc: '',
  amount: '',
  category: 'Food & Dining',
  type: 'expense',
  date: new Date().toISOString().slice(0, 10),
};

export default function TransactionModal({ onClose, existing }) {
  const { state, addTransaction, updateTransaction } = useApp();
  const [form, setForm] = useState(existing ? { ...existing, amount: String(existing.amount) } : blank);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const isLoading = state.apiStatus === 'loading';

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.desc.trim()) errs.desc = 'Description is required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!form.date) errs.date = 'Date is required';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const txn = {
      ...form,
      amount: parseFloat(parseFloat(form.amount).toFixed(2)),
      id: existing ? existing.id : makeId(),
    };

    if (existing) {
      await updateTransaction(txn);
    } else {
      await addTransaction(txn);
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{existing ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="modal-close" onClick={onClose}><XIcon /></button>
        </div>

        <div className="type-toggle">
          <button
            className={`type-toggle-btn ${form.type === 'income' ? 'active-income' : ''}`}
            onClick={() => setForm(f => ({ ...f, type: 'income' }))}
          >↑ Income</button>
          <button
            className={`type-toggle-btn ${form.type === 'expense' ? 'active-expense' : ''}`}
            onClick={() => setForm(f => ({ ...f, type: 'expense' }))}
          >↓ Expense</button>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input className="form-input" placeholder="e.g. Grocery run" value={form.desc} onChange={set('desc')} />
          {errors.desc && <span style={{ color: 'var(--red)', fontSize: '0.75rem' }}>{errors.desc}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Amount ($)</label>
            <input className="form-input" type="number" min="0.01" step="0.01" placeholder="0.00" value={form.amount} onChange={set('amount')} />
            {errors.amount && <span style={{ color: 'var(--red)', fontSize: '0.75rem' }}>{errors.amount}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input className="form-input" type="date" value={form.date} onChange={set('date')} />
            {errors.date && <span style={{ color: 'var(--red)', fontSize: '0.75rem' }}>{errors.date}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-input" value={form.category} onChange={set('category')}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={isLoading}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={isLoading}>
            {isLoading
              ? (existing ? 'Saving...' : 'Adding...')
              : (existing ? 'Save Changes' : 'Add Transaction')}
          </button>
        </div>
      </div>
    </div>
  );
}
