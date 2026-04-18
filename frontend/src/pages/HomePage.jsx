import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

const features = [
  {
    title: 'Creator tools',
    text: 'Upload photos, add rich details, and manage your published content from one streamlined workspace.'
  },
  {
    title: 'Viewer discovery',
    text: 'Browse, search, open photo details, and engage with content through comments and ratings.'
  },
  {
    title: 'Fast modern experience',
    text: 'A responsive frontend with clean navigation, searchable content, and room for smart media optimisation.'
  },
  {
    title: 'Smarter media workflows',
    text: 'AI tags and thumbnail generation are built into the product flow to improve discovery and performance.'
  }
];

export default function HomePage() {
  return (
    <AppLayout>
      <div className="page-shell">
        <section className="hero-wrap">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Cloud Photo Platform</p>
              <h1 className="hero-title">PixScale</h1>
              <p className="hero-subtitle">
                A modern photo sharing platform for creators and viewers, designed for clean publishing,
                fast discovery, and a polished multi-user experience.
              </p>

              <div className="hero-actions">
                <Link className="btn btn-primary" to="/login">Sign In</Link>
                <Link className="btn btn-secondary" to="/gallery">Explore Gallery</Link>
              </div>

              <div className="hero-badges">
                <span className="pill">Photo uploads</span>
                <span className="pill">Rich metadata</span>
                <span className="pill">Search and discovery</span>
                <span className="pill">Comments and ratings</span>
              </div>
            </div>

            <div className="hero-panel">
              <div className="metric-card">
                <p className="metric-label">Publishing</p>
                <h3>Upload, describe, and manage photos with ease</h3>
              </div>
              <div className="metric-card">
                <p className="metric-label">Discovery</p>
                <h3>Search by title, caption, location, people, and tags</h3>
              </div>
              <div className="metric-card">
                <p className="metric-label">Enhancement</p>
                <h3>Thumbnail and AI-assisted media workflows</h3>
              </div>
            </div>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article key={feature.title} className="feature-card">
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
