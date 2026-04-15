import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export function Shell({ children }) {
  const [navOpen, setNavOpen] = React.useState(false);

  return (
    <div className="app-shell">
      <header className="topbar glass">
        <Link className="brand" to="/">E-Learning</Link>
        <button
          className="icon-button mobile-only"
          type="button"
          aria-expanded={navOpen}
          aria-label="Toggle navigation"
          onClick={() => setNavOpen((value) => !value)}
        >
          Menu
        </button>
        <nav className={`nav ${navOpen ? 'open' : ''}`}>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>Home</NavLink>
          <NavLink to="/courses" className={({ isActive }) => (isActive ? 'active' : undefined)}>Courses</NavLink>
          <NavLink to="/dashboard/student" className={({ isActive }) => (isActive ? 'active' : undefined)}>Student</NavLink>
          <NavLink to="/dashboard/instructor" className={({ isActive }) => (isActive ? 'active' : undefined)}>Instructor</NavLink>
          <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : undefined)}>Login</NavLink>
        </nav>
      </header>
      <main className="main-content">{children}</main>
      <footer className="footer glass">
        <div>
          <strong>E-Learning Platform</strong>
          <p>React frontend with animated cards, premium buttons, and clearer structure.</p>
        </div>
        <p className="muted">Connected to Django REST API</p>
      </footer>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      {action || null}
    </div>
  );
}
