import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, colorClass = 'stat-emerald', onClick }) {
  return (
    <div className={`stat-card ${colorClass} ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      <div className="stat-card-inner">
        <div className="stat-content">
          <p className="stat-title">{title}</p>
          <h3 className="stat-value">{value}</h3>
          {subtitle && <p className="stat-subtitle">{subtitle}</p>}
        </div>
        <div className="stat-icon-wrapper">
          {Icon && <Icon size={24} />}
        </div>
      </div>
    </div>
  );
}
