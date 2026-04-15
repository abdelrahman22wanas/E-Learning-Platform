import React from 'react';

export default function EmptyState({ title, message, action }) {
  return (
    <div className="empty-box glass">
      <h3>{title}</h3>
      <p className="muted">{message}</p>
      {action || null}
    </div>
  );
}
