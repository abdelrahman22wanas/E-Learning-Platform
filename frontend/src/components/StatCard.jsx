import React from 'react';

export default function StatCard({ label, value, hint }) {
  return (
    <article className="stat-card glass">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {hint ? <p className="muted">{hint}</p> : null}
    </article>
  );
}
