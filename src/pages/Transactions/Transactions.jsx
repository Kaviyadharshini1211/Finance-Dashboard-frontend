import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, CATEGORY_COLORS } from '../../data/mockData';
import TransactionModal from '../../components/TransactionModal/TransactionModal';
import EmptyState from '../../components/EmptyState/EmptyState';
import './Transactions.css';

const PAGE_SIZE = 12;

function exportCSV(transactions) {
  const header = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map(t => [t.date, `"${t.desc}"`, t.category, t.type, t.amount]);
  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'finflow_transactions.csv'; a.click();
  URL.revokeObjectURL(url);
}

function exportJSON(transactions) {
  const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'finflow_transactions.json'; a.click();
  URL.revokeObjectURL(url);
}

export default function Transactions() {
  const { state, dispatch, deleteTransaction } = useApp();
  const { filters, role } = state;

  const [modal, setModal] = useState(null); // null | 'add' | transaction
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);

  const setFilter = (obj) => {
    dispatch({ type: 'SET_FILTER', payload: obj });
    setPage(1);
  };

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
    setPage(1);
  };

  // Filter + Sort
  const filtered = useMemo(() => {
    let list = [...state.transactions];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(t =>
        t.desc.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    if (filters.type !== 'all') list = list.filter(t => t.type === filters.type);
    if (filters.category !== 'all') list = list.filter(t => t.category === filters.category);
    if (filters.dateFrom) list = list.filter(t => t.date >= filters.dateFrom);
    if (filters.dateTo) list = list.filter(t => t.date <= filters.dateTo);

    list.sort((a, b) => {
      let va = a[filters.sortBy], vb = b[filters.sortBy];
      if (filters.sortBy === 'amount') { va = +va; vb = +vb; }
      if (va < vb) return filters.sortDir === 'asc' ? -1 : 1;
      if (va > vb) return filters.sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [state.transactions, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (col) => {
    if (filters.sortBy === col) {
      setFilter({ sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' });
    } else {
      setFilter({ sortBy: col, sortDir: 'desc' });
    }
  };

  const sortIcon = (col) => {
    if (filters.sortBy !== col) return '↕';
    return filters.sortDir === 'asc' ? '↑' : '↓';
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    setConfirmDelete(null);
  };

  const filteredIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const filteredExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="page-wrapper">
      <div className="transactions-header">
        <div>
          <h1>Transactions</h1>
          <p>Browse, filter, and manage all your transactions</p>
        </div>
        <div className="txn-actions">
          <div style={{ position: 'relative' }}>
            <button className="btn btn-ghost" onClick={() => setExportOpen(o => !o)}>
              ↓ Export
            </button>
            {exportOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '110%', background: 'var(--bg-card)',
                border: '1px solid var(--border-strong)', borderRadius: 10, overflow: 'hidden',
                boxShadow: 'var(--shadow-md)', zIndex: 10, minWidth: 140
              }}>
                {[['CSV', () => exportCSV(filtered)], ['JSON', () => exportJSON(filtered)]].map(([label, fn]) => (
                  <button key={label} style={{
                    display: 'block', width: '100%', padding: '10px 16px', textAlign: 'left',
                    background: 'none', border: 'none', color: 'var(--text-primary)',
                    fontSize: '0.85rem', cursor: 'pointer', transition: 'background 0.1s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    onClick={() => { fn(); setExportOpen(false); }}>
                    Export as {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {role === 'admin' && (
            <button className="btn btn-primary" onClick={() => setModal('add')}>
              + Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-search">
          <span className="filter-search-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            className="form-input"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={e => setFilter({ search: e.target.value })}
          />
        </div>

        <div className="filter-group">
          <span className="filter-label">Type</span>
          <select className="form-input" value={filters.type} onChange={e => setFilter({ type: e.target.value })}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Category</span>
          <select className="form-input" value={filters.category} onChange={e => setFilter({ category: e.target.value })}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">From</span>
          <input className="form-input" type="date" value={filters.dateFrom} onChange={e => setFilter({ dateFrom: e.target.value })} />
        </div>

        <div className="filter-group">
          <span className="filter-label">To</span>
          <input className="form-input" type="date" value={filters.dateTo} onChange={e => setFilter({ dateTo: e.target.value })} />
        </div>

        <button className="filter-reset" onClick={resetFilters}>✕ Reset</button>
      </div>

      {/* Stats Strip */}
      <div style={{
        display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap'
      }}>
        {[
          { label: 'Shown', val: filtered.length + ' transactions', color: 'var(--text-primary)' },
          { label: 'Income', val: `+$${filteredIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: 'var(--green)' },
          { label: 'Expenses', val: `−$${filteredExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: 'var(--red)' },
          { label: 'Net', val: `$${(filteredIncome - filteredExpense).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: filteredIncome >= filteredExpense ? 'var(--green)' : 'var(--red)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 16px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.92rem', fontWeight: 500, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="txn-table-wrap">
        <div className="table-scroll">
          {paged.length === 0 ? (
            <EmptyState icon="🔍" title="No transactions found" desc="Try adjusting your filters." />
          ) : (
            <table>
              <thead>
                <tr>
                  <th className={filters.sortBy === 'date' ? 'sorted' : ''} onClick={() => toggleSort('date')}>
                    Date <span className="sort-icon">{sortIcon('date')}</span>
                  </th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th className={filters.sortBy === 'amount' ? 'sorted' : ''} onClick={() => toggleSort('amount')}>
                    Amount <span className="sort-icon">{sortIcon('amount')}</span>
                  </th>
                  {role === 'admin' && <th style={{ textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paged.map((t, i) => (
                  <tr key={t.id} style={{ animationDelay: `${i * 0.03}s` }}>
                    <td className="td-date">
                      {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="td-desc">
                      <div className="td-desc-text">{t.desc}</div>
                    </td>
                    <td>
                      <div className="td-cat">
                        <div className="cat-dot" style={{ background: CATEGORY_COLORS[t.category] || '#94a3b8' }} />
                        {t.category}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${t.type}`}>
                        {t.type === 'income' ? '↑' : '↓'} {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                      </span>
                    </td>
                    <td className={`td-amount ${t.type}`}>
                      {t.type === 'income' ? '+' : '−'}${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    {role === 'admin' && (
                      <td>
                        <div className="row-actions">
                          <button className="action-btn" onClick={() => setModal(t)}>Edit</button>
                          <button className="action-btn delete" onClick={() => setConfirmDelete(t.id)}>Delete</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {filtered.length > PAGE_SIZE && (
          <div className="pagination">
            <span className="pagination-info">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="pagination-controls">
              <button className="page-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
              <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const p = start + i;
                return p <= totalPages ? (
                  <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                ) : null;
              })}
              <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
              <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="modal-backdrop" onClick={() => setConfirmDelete(null)}>
          <div className="modal" style={{ maxWidth: 360 }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🗑️</div>
              <h3 style={{ marginBottom: 8, fontSize: '1rem' }}>Delete Transaction?</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 24 }}>
                This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <TransactionModal
          onClose={() => setModal(null)}
          existing={modal !== 'add' ? modal : undefined}
        />
      )}
    </div>
  );
}
