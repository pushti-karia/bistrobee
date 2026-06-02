import './StatsCard.css';

const StatsCard = ({ icon: Icon, label, value, change, color = 'primary', prefix = '' }) => {
  const isPositive = change >= 0;

  return (
    <div className={`stats-card stats-${color}`}>
      <div className="stats-icon">
        <Icon size={24} />
      </div>
      <div className="stats-content">
        <p className="stats-label">{label}</p>
        <p className="stats-value">{prefix}{value?.toLocaleString?.() ?? value}</p>
        {change !== undefined && (
          <p className={`stats-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(change)}% vs last week
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
