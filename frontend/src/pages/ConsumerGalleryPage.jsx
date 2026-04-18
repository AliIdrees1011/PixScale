import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { getHealth, getPhotos } from '../services/api';
import { samplePhotos } from '../data/samplePhotos';

export default function ConsumerGalleryPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [photos, setPhotos] = useState(samplePhotos);
  const [statusText, setStatusText] = useState('Showing available gallery content.');
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function loadPhotos() {
    setIsRefreshing(true);
    try {
      const [health, data] = await Promise.all([getHealth(), getPhotos()]);
      if (Array.isArray(data) && data.length >= 0) {
        setPhotos(data.length > 0 ? data : samplePhotos);
      }
      setStatusText(`Backend connected. Persistence: ${health.persistence}. Media mode: ${health.media}.`);
    } catch {
      setPhotos(samplePhotos);
      setStatusText('Running in local preview mode.');
    } finally {
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      const haystack = [
        photo.title,
        photo.caption,
        photo.location,
        photo.peoplePresent,
        photo.category,
        ...(photo.aiTags || [])
      ].join(' ').toLowerCase();

      const matchesQuery = haystack.includes(query.toLowerCase());
      const matchesCategory = category === 'All' || photo.category === category;

      return matchesQuery && matchesCategory;
    });
  }, [photos, query, category]);

  return (
    <AppLayout>
      <div className="page-shell">
        <section className="gallery-wrap">
          <div className="gallery-head">
            <div>
              <p className="eyebrow">Gallery</p>
              <h1>Browse and search shared photos</h1>
              <p className="page-intro">
                Explore uploaded content, discover tags, and open full photo details.
              </p>
            </div>
            <div className="dashboard-actions">
              <button type="button" className="btn btn-secondary" onClick={loadPhotos} disabled={isRefreshing}>
                {isRefreshing ? 'Refreshing...' : 'Refresh Gallery'}
              </button>
            </div>
          </div>

          <div className="notice">{statusText}</div>

          <div className="search-bar-card">
            <div className="search-grid">
              <label>
                Search photos
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, caption, location, people, or tags" />
              </label>
              <label>
                Category
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  <option>All</option>
                  <option>Travel</option>
                  <option>Portrait</option>
                  <option>Nature</option>
                  <option>Urban</option>
                  <option>Events</option>
                  <option>General</option>
                </select>
              </label>
            </div>
          </div>

          <div className="gallery-grid">
            {filteredPhotos.map((photo) => (
              <article key={photo.id} className="gallery-card">
                <img src={photo.thumbnailUrl || photo.imageUrl} alt={photo.title} className="gallery-image" />
                <div className="gallery-content">
                  <div className="gallery-top">
                    <div>
                      <h3>{photo.title}</h3>
                      <p>{photo.location}</p>
                    </div>
                    <span className="rating-badge">★ {photo.rating}</span>
                  </div>
                  <p className="gallery-caption">{photo.caption}</p>
                  <div className="tag-row">
                    {(photo.aiTags || []).map((tag) => (
                      <span key={tag} className="pill small">#{tag}</span>
                    ))}
                  </div>
                  <div className="gallery-actions">
                    <Link className="btn btn-primary" to={`/photo/${photo.id}`}>Open Details</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredPhotos.length === 0 && (
            <div className="notice">
              No photos match your current search. Try another keyword or category.
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
