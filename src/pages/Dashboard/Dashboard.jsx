import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { getMonthlyData, getCategoryData, CATEGORY_COLORS } from '../../data/mockData';
import SummaryCard from '../../components/SummaryCard/SummaryCard';
import TransactionModal from '../../components/TransactionModal/TransactionModal';
import EmptyState from '../../components/EmptyState/EmptyState';
import './Dashboard.css';

const CATEGORY_EMOJI = {
  'Food & Dining': '🍔', 'Transportation': '🚗', 'Shopping': '🛍️',
  'Entertainment': '🎭', 'Healthcare': '💊', 'Utilities': '⚡',
  'Rent': '🏠', 'Salary': '💼', 'Freelance': '💻',
  'Investment': '📈', 'Travel': '✈️', 'Education': '📚',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-strong)',
      borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)',
      fontSize: '0.8rem'
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color, display: 'flex', gap: 8, justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>
            ${p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const [showModal, setShowModal] = useState(false);

  const { transactions, role } = state;

  const totalIncome = useMemo(() => transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpense = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [transactions]);
  const balance = totalIncome - totalExpense;

  const monthlyData = useMemo(() => getMonthlyData(transactions), [transactions]);
  const categoryData = useMemo(() => getCategoryData(transactions).slice(0, 6), [transactions]);

  // Trend: compare last two months
  const lastTwo = monthlyData.slice(-2);
  const balanceTrend = lastTwo.length === 2 && lastTwo[0].balance !== 0
    ? ((lastTwo[1].balance - lastTwo[0].balance) / Math.abs(lastTwo[0].balance)) * 100
    : null;

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  const savings = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : '0.0';

  return (
    <div className="page-wrapper">
      <div className="dashboard-header">
        <div>
          <h1>Overview</h1>
          <p>Your financial summary at a glance</p>
        </div>
        <div className="dashboard-actions">
          {role === 'admin' && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              + Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <SummaryCard
          label="Total Balance"
          value={balance}
          icon="💰"
          color="blue"
          valueClass={balance >= 0 ? 'positive' : 'negative'}
          trend={balanceTrend}
          trendLabel="vs last month"
        />
        <SummaryCard
          label="Total Income"
          value={totalIncome}
          icon="📈"
          color="green"
          trendLabel={`${transactions.filter(t => t.type === 'income').length} transactions`}
        />
        <SummaryCard
          label="Total Expenses"
          value={totalExpense}
          icon="📉"
          color="red"
          trendLabel={`${transactions.filter(t => t.type === 'expense').length} transactions`}
        />
        <SummaryCard
          label="Savings Rate"
          value={`${savings}%`}
          icon="🏦"
          color="amber"
          trendLabel="of total income saved"
        />
      </div>

      {/* Charts */}
      <div className="charts-row">
        {/* Balance Trend */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Cash Flow Trend</div>
              <div className="chart-card-subtitle">Income vs Expenses over time</div>
            </div>
          </div>
          {monthlyData.length === 0 ? (
            <EmptyState icon="📊" title="No data yet" desc="Add some transactions to see your trend." />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
                  tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="income" name="Income" stroke="#22c55e" strokeWidth={2}
                  fill="url(#incomeGrad)" dot={{ fill: '#22c55e', r: 3, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" strokeWidth={2}
                  fill="url(#expenseGrad)" dot={{ fill: '#f43f5e', r: 3, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Spending Breakdown */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Spending by Category</div>
              <div className="chart-card-subtitle">Top 6 expense categories</div>
            </div>
          </div>
          {categoryData.length === 0 ? (
            <EmptyState icon="🍩" title="No expenses" desc="Expense data will appear here." />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                    paddingAngle={3} dataKey="value">
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {categoryData.map(c => (
                  <div key={c.name} className="legend-item">
                    <div className="legend-dot" style={{ background: c.color }} />
                    <span className="legend-name">{c.name}</span>
                    <span className="legend-val">${c.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="recent-section">
        <div className="recent-header">
          <span className="recent-title">Recent Transactions</span>
          <Link to="/transactions" className="recent-link">View all →</Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState icon="💳" title="No transactions yet" desc="Add your first transaction to get started." />
        ) : (
          recent.map((t, i) => (
            <div key={t.id} className="txn-row" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="txn-icon">{CATEGORY_EMOJI[t.category] || '💳'}</div>
              <div className="txn-info">
                <div className="txn-desc">{t.desc}</div>
                <div className="txn-meta">{t.category} · {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
              <span className={`txn-amount ${t.type}`}>
                {t.type === 'income' ? '+' : '−'}${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))
        )}
      </div>

      {showModal && <TransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
