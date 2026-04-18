import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import { mapRoleTarget } from '../services/authService';

export default function LoginPage() {
  const [role, setRole] = useState('consumer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleLogin() {
    login(role, email);
    navigate(mapRoleTarget(role));
  }

  return (
    <AppLayout>
      <div className="page-shell">
        <div className="auth-layout">
          <div className="auth-card">
            <p className="eyebrow">Welcome Back</p>
            <h1>Sign in to PixScale</h1>
            <p className="page-intro">
              Choose your access type and continue to your dashboard or gallery experience.
            </p>

            <div className="role-switch">
              <button type="button" className={role === 'consumer' ? 'role-btn active' : 'role-btn'} onClick={() => setRole('consumer')}>
                Viewer
              </button>
              <button type="button" className={role === 'creator' ? 'role-btn active' : 'role-btn'} onClick={() => setRole('creator')}>
                Creator
              </button>
            </div>

            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <label>
                Email
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={role === 'creator' ? 'creator@pixscale.app' : 'viewer@pixscale.app'} />
              </label>
              <label>
                Password
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" />
              </label>
              <button type="button" className="btn btn-primary full-width" onClick={handleLogin}>
                Continue as {role === 'creator' ? 'Creator' : 'Viewer'}
              </button>
            </form>

            <div className="auth-links">
              <Link to="/">Back to Home</Link>
              <Link to={role === 'creator' ? '/creator' : '/gallery'}>
                Skip ahead to {role === 'creator' ? 'Creator Dashboard' : 'Gallery'}
              </Link>
            </div>
          </div>

          <aside className="info-card">
            <p className="eyebrow">Access Options</p>
            <h2>Choose your experience</h2>
            <ul className="info-list">
              <li>Creators can upload and manage photo content</li>
              <li>Viewers can browse, search, comment, and rate photos</li>
              <li>Role-aware access keeps workflows clear and focused</li>
              <li>Ready for future authentication integration</li>
            </ul>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}
