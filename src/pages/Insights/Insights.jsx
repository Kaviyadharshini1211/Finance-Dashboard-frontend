import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { getMonthlyData, getCategoryData, CATEGORY_COLORS } from '../../data/mockData';
import EmptyState from '../../components/EmptyState/EmptyState';
import './Insights.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-strong)',
      borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)', fontSize: '0.8rem'
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 500, color: p.color }}>
            ${Number(p.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function Insights() {
  const { state } = useApp();
  const { transactions } = state;

  const monthlyData = useMemo(() => getMonthlyData(transactions), [transactions]);
  const categoryData = useMemo(() => getCategoryData(transactions), [transactions]);

  const totalExpense = useMemo(() =>
    transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalIncome = useMemo(() =>
    transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [transactions]);

  const topCategory = categoryData[0];
  const avgMonthlyExpense = monthlyData.length
    ? (monthlyData.reduce((s, m) => s + m.expenses, 0) / monthlyData.length)
    : 0;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100) : 0;

  // Last two months comparison
  const lastTwo = monthlyData.slice(-2);
  const prevMonth = lastTwo[0];
  const currMonth = lastTwo[1];

  const pct = (curr, prev) => {
    if (!prev || prev === 0) return null;
    return ((curr - prev) / prev * 100).toFixed(1);
  };

  // Radar: category spending normalised
  const maxCat = categoryData[0]?.value || 1;
  const radarData = categoryData.slice(0, 7).map(c => ({
    subject: c.name.split(' ')[0],
    value: Math.round((c.value / maxCat) * 100),
  }));

  if (transactions.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="insights-header"><h1>Insights</h1></div>
        <EmptyState icon="📊" title="No data yet" desc="Add some transactions to unlock insights." />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="insights-header">
        <h1>Insights</h1>
        <p>Patterns and observations from your financial data</p>
      </div>

      {/* Quick Insight Cards */}
      <div className="insight-cards">
        <div className="insight-card">
          <div className="insight-label">🏆 Top Spending Category</div>
          <div className="insight-main">
            <div className="insight-value" style={{ color: topCategory ? CATEGORY_COLORS[topCategory.name] : 'var(--text-primary)', fontSize: '1.3rem' }}>
              {topCategory?.name || '—'}
            </div>
          </div>
          <div className="insight-sub">
            ${topCategory?.value.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'} total spent
            {totalExpense > 0 && topCategory ? ` · ${(topCategory.value / totalExpense * 100).toFixed(1)}% of expenses` : ''}
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-label">📊 Avg Monthly Expense</div>
          <div className="insight-main">
            <div className="insight-value red">
              ${avgMonthlyExpense.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="insight-sub">
            Over {monthlyData.length} month{monthlyData.length !== 1 ? 's' : ''} of data
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-label">💰 Overall Savings Rate</div>
          <div className="insight-main">
            <div className={`insight-value ${savingsRate >= 20 ? 'green' : savingsRate >= 0 ? 'amber' : 'red'}`}>
              {savingsRate.toFixed(1)}%
            </div>
          </div>
          <div className="insight-sub">
            {savingsRate >= 20
              ? '✅ Excellent — well above the 20% target'
              : savingsRate >= 10
              ? '⚠️ Moderate — aim for 20%+ savings'
              : '🔴 Low — consider reducing expenses'}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="insights-charts">
        {/* Monthly Bar */}
        <div className="insight-chart-card">
          <div className="icc-header">
            <div className="icc-title">Monthly Income vs Expenses</div>
            <div className="icc-subtitle">Side-by-side comparison per month</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div className="insight-chart-card">
          <div className="icc-header">
            <div className="icc-title">Spending Shape</div>
            <div className="icc-subtitle">Relative spending by category</div>
          </div>
          {radarData.length === 0 ? (
            <EmptyState icon="🕸️" title="No data" desc="Add expenses to see your spending shape." />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Radar name="Spending" dataKey="value" stroke="#4f7cff" fill="#4f7cff" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip formatter={v => [`${v}%`, 'Relative spend']} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="cat-breakdown">
        <div className="cat-breakdown-header">
          <span className="cat-breakdown-title">Expense Breakdown by Category</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {categoryData.length} categories · ${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })} total
          </span>
        </div>
        {categoryData.length === 0 ? (
          <EmptyState icon="📂" title="No expenses" desc="Expense categories will appear here." />
        ) : (
          categoryData.map((cat, i) => {
            const pctOfTotal = totalExpense > 0 ? (cat.value / totalExpense * 100) : 0;
            return (
              <div key={cat.name} className="cat-row" style={{ animationDelay: `${i * 0.04}s` }}>
                <span className="cat-rank">#{i + 1}</span>
                <div className="cat-color-bar" style={{ background: cat.color }} />
                <div className="cat-info">
                  <div className="cat-name">{cat.name}</div>
                  <div className="cat-progress-wrap">
                    <div className="cat-progress-bg">
                      <div
                        className="cat-progress-fill"
                        style={{ width: `${pctOfTotal}%`, background: cat.color }}
                      />
                    </div>
                    <span className="cat-pct">{pctOfTotal.toFixed(1)}%</span>
                  </div>
                </div>
                <span className="cat-amount">
                  ${cat.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Monthly Comparison */}
      {lastTwo.length === 2 && (
        <div className="monthly-compare">
          <div className="icc-title">Month-over-Month Comparison</div>
          <div className="icc-subtitle" style={{ marginTop: 4 }}>
            Comparing {prevMonth.label} vs {currMonth.label}
          </div>
          <div className="month-cols">
            {[prevMonth, currMonth].map((m, idx) => (
              <div key={m.month} className="month-col">
                <div className="month-col-label">{idx === 0 ? '← Previous' : 'Current →'} · {m.label}</div>
                {[
                  { label: 'Income', val: `$${m.income.toLocaleString()}`, cls: 'green' },
                  { label: 'Expenses', val: `$${m.expenses.toLocaleString()}`, cls: 'red' },
                  { label: 'Net Balance', val: `$${(m.income - m.expenses).toLocaleString()}`, cls: m.income >= m.expenses ? 'green' : 'red' },
                  { label: 'Savings Rate', val: m.income > 0 ? `${((m.income - m.expenses) / m.income * 100).toFixed(1)}%` : '—', cls: '' },
                ].map(s => (
                  <div key={s.label} className="month-stat">
                    <span className="month-stat-label">{s.label}</span>
                    <span className={`month-stat-val ${s.cls}`}>{s.val}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Delta summary */}
          <div style={{
            marginTop: 16, padding: '14px 18px', background: 'var(--bg-secondary)',
            borderRadius: 10, border: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: 16
          }}>
            {[
              { label: 'Income change', val: pct(currMonth.income, prevMonth.income), suffix: '%' },
              { label: 'Expense change', val: pct(currMonth.expenses, prevMonth.expenses), suffix: '%', invert: true },
              { label: 'Net change', val: pct(currMonth.balance, prevMonth.balance), suffix: '%' },
            ].map(item => {
              const v = parseFloat(item.val);
              const good = item.invert ? v < 0 : v >= 0;
              return (
                <div key={item.label} style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                    {item.label}
                  </div>
                  <div style={{
                    fontFamily: 'DM Mono, monospace', fontWeight: 600, fontSize: '1.1rem',
                    color: item.val === null ? 'var(--text-muted)' : good ? 'var(--green)' : 'var(--red)'
                  }}>
                    {item.val === null ? '—' : `${v >= 0 ? '+' : ''}${v}%`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
