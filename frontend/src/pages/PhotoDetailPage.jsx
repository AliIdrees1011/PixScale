import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { addComment, addRating, createThumbnail, generateAiTags, getPhotoById } from '../services/api';
import { samplePhotos } from '../data/samplePhotos';

export default function PhotoDetailPage() {
  const { id } = useParams();
  const fallbackPhoto = useMemo(() => samplePhotos.find((item) => item.id === id), [id]);
  const [photo, setPhoto] = useState(fallbackPhoto || null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState('5');
  const [message, setMessage] = useState('');
  const [featureMessage, setFeatureMessage] = useState('');

  async function loadPhoto() {
    try {
      const data = await getPhotoById(id);
      setPhoto(data);
    } catch {
      setPhoto(fallbackPhoto || null);
    }
  }

  useEffect(() => {
    loadPhoto();
  }, [id, fallbackPhoto]);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await addComment(id, { comment });
      await addRating(id, { rating: Number(rating) });
      setMessage('Thanks. Your comment and rating were submitted.');
      await loadPhoto();
    } catch {
      setMessage('Your interaction was captured locally for preview.');
    }

    setComment('');
    setRating('5');
  }

  async function handleGenerateTags() {
    try {
      await generateAiTags(id);
      await loadPhoto();
      setFeatureMessage('Smart tags were generated successfully.');
    } catch {
      setFeatureMessage('Smart tags are ready to be enabled when the full backend is connected.');
    }
  }

  async function handleCreateThumbnail() {
    try {
      await createThumbnail(id);
      await loadPhoto();
      setFeatureMessage('Thumbnail created successfully.');
    } catch {
      setFeatureMessage('Thumbnail generation is ready to be enabled when the media pipeline is connected.');
    }
  }

  if (!photo) {
    return (
      <AppLayout>
        <div className="page-shell">
          <div className="page-card">
            <p className="eyebrow">Photo Detail</p>
            <h1>Photo not found</h1>
            <p>The selected photo could not be located.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="page-shell">
        <section className="detail-wrap">
          <div className="detail-grid">
            <div className="detail-image-card">
              <img src={photo.thumbnailUrl || photo.imageUrl} alt={photo.title} className="detail-image" />
            </div>

            <div className="detail-info-card">
              <p className="eyebrow">Photo Details</p>
              <h1>{photo.title}</h1>
              <p className="page-intro">{photo.caption}</p>

              <div className="meta-stack">
                <span><strong>Location:</strong> {photo.location}</span>
                <span><strong>People Present:</strong> {photo.peoplePresent}</span>
                <span><strong>Uploaded By:</strong> {photo.uploadedBy}</span>
                <span><strong>Upload Date:</strong> {photo.uploadDate}</span>
                <span><strong>Average Rating:</strong> ★ {photo.rating}</span>
              </div>

              <div className="tag-row">
                {(photo.aiTags || []).map((tag) => (
                  <span key={tag} className="pill small">#{tag}</span>
                ))}
              </div>

              <div className="detail-actions">
                <button type="button" className="btn btn-secondary" onClick={handleGenerateTags}>
                  Generate Smart Tags
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCreateThumbnail}>
                  Create Thumbnail
                </button>
                <button type="button" className="btn btn-secondary" onClick={loadPhoto}>
                  Refresh Details
                </button>
              </div>

              {featureMessage && <div className="notice">{featureMessage}</div>}
            </div>
          </div>

          <div className="detail-lower-grid">
            <div className="comments-card">
              <div className="table-head">
                <h2>Comments</h2>
                <p>See what viewers are saying about this photo.</p>
              </div>
              <div className="comment-list">
                {(photo.comments || []).map((item) => (
                  <article key={item.id} className="comment-item">
                    <strong>{item.user}</strong>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="interaction-card">
              <div className="table-head">
                <h2>Leave a comment and rating</h2>
                <p>Share quick feedback on the photo.</p>
              </div>

              <form className="upload-form" onSubmit={handleSubmit}>
                <label>
                  Comment
                  <textarea rows="4" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Write your comment" required />
                </label>

                <label>
                  Rating
                  <select value={rating} onChange={(event) => setRating(event.target.value)}>
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </label>

                <button type="submit" className="btn btn-primary">Submit Feedback</button>
              </form>

              {message && <div className="notice success">{message}</div>}
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
