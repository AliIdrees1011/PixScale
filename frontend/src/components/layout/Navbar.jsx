import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/upload', label: 'Upload' }
  ];

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand-mark">
          <span className="brand-mark__dot" />
          <span>PixScale</span>
        </Link>

        <nav className="site-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => isActive ? 'site-nav__link active' : 'site-nav__link'}
            >
              {item.label}
            </NavLink>
          ))}
          {user.isAuthenticated && user.role === 'creator' && (
            <NavLink
              to="/creator"
              className={({ isActive }) => isActive ? 'site-nav__link active' : 'site-nav__link'}
            >
              Creator
            </NavLink>
          )}
        </nav>

        <div className="site-header__actions">
          {user.isAuthenticated ? (
            <>
              <div className="user-chip">
                <span className="user-chip__role">{user.role}</span>
                <span className="user-chip__name">{user.name}</span>
              </div>
              <button type="button" className="btn btn-secondary btn-small" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-small">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
