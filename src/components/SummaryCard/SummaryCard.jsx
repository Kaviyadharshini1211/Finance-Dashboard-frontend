import './SummaryCard.css';

export default function SummaryCard({ label, value, icon, color = 'blue', trend, trendLabel, valueClass }) {
  return (
    <div className="summary-card">
      <div className="card-header">
        <span className="card-label">{label}</span>
        <div className={`card-icon ${color}`}>{icon}</div>
      </div>

      <div className={`card-value ${valueClass || ''}`}>
        {typeof value === 'number'
          ? `$${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : value}
      </div>

      {trendLabel && (
        <div className="card-footer">
          {trend !== undefined && (
            <span className={`card-trend ${trend >= 0 ? 'up' : 'down'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
            </span>
          )}
          <span>{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
