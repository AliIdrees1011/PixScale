import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';

const items = [
  {
    title: 'Upload new content',
    text: 'Add photos with detailed metadata so your content is easy to discover and manage.'
  },
  {
    title: 'Track published items',
    text: 'Monitor recent uploads and keep your creator workspace organised.'
  },
  {
    title: 'Improve discoverability',
    text: 'Use smart tags and image optimisation tools to make content easier to find and faster to load.'
  }
];

const recent = [
  { id: 'PXS-101', name: 'Golden Hour in Porto', status: 'Published', date: '21 Apr 2026' },
  { id: 'PXS-102', name: 'Studio Portrait Minimal', status: 'Published', date: '19 Apr 2026' },
  { id: 'PXS-103', name: 'Urban Night Motion', status: 'Draft', date: '17 Apr 2026' }
];

export default function CreatorDashboard() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="page-shell">
        <section className="dashboard-wrap">
          <div className="dashboard-head">
            <div>
              <p className="eyebrow">Creator Studio</p>
              <h1>Manage your photo publishing workflow</h1>
              <p className="page-intro">
                {user.isAuthenticated ? `Signed in as ${user.name}.` : 'Manage your uploads, metadata, and media workflow.'}
              </p>
            </div>
            <div className="dashboard-actions">
              <Link className="btn btn-primary" to="/upload">Upload New Photo</Link>
              <Link className="btn btn-secondary" to="/gallery">Open Gallery</Link>
            </div>
          </div>

          <div className="feature-grid">
            {items.map((item) => (
              <article key={item.title} className="feature-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>

          <div className="table-card">
            <div className="table-head">
              <h2>Recent items</h2>
              <p>Your latest photo records and publishing status.</p>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>ID</th><th>Photo</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {recent.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td><span className={item.status === 'Published' ? 'status ok' : 'status draft'}>{item.status}</span></td>
                      <td>{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
