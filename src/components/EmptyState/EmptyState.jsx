import './EmptyState.css';

export default function EmptyState({ icon = '📭', title = 'Nothing here', desc = 'No data to display.' }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      <div className="empty-desc">{desc}</div>
    </div>
  );
}
