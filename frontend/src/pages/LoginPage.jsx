import React from 'react';

export default function LoginPage() {
  return (
    <div className="page-stack auth-page">
      <section className="auth-card glass">
        <p className="eyebrow">Sign in</p>
        <h1>Login</h1>
        <p>Connect this screen to JWT authentication when you are ready.</p>
        <div className="auth-grid">
          <input className="input" placeholder="Username" />
          <input className="input" placeholder="Password" type="password" />
          <button className="button button-secondary" type="button">Sign in</button>
        </div>
      </section>
    </div>
  );
}
