import React, { useEffect, useMemo, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { uploadPhoto, uploadPhotoForm } from '../services/api';

const initialState = {
  title: '',
  caption: '',
  location: '',
  peoplePresent: '',
  category: 'Travel',
  imageUrl: ''
};

export default function UploadPhotoPage() {
  const [form, setForm] = useState(initialState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [apiState, setApiState] = useState('idle');
  const [message, setMessage] = useState('');
  const [lastCreatedId, setLastCreatedId] = useState('');

  const localPreview = useMemo(() => {
    if (!selectedFile) return '';
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSubmitted(false);
    setMessage('');
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setSubmitted(false);
    setMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    setApiState('ready');
    setMessage('');
    setLastCreatedId('');

    try {
      let created;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('caption', form.caption);
        formData.append('location', form.location);
        formData.append('peoplePresent', form.peoplePresent);
        formData.append('category', form.category);
        formData.append('imageFile', selectedFile);
        created = await uploadPhotoForm(formData);
        setMessage('Photo file uploaded successfully.');
      } else {
        created = await uploadPhoto(form);
        setMessage('Photo metadata submitted successfully.');
      }

      setApiState('success');
      if (created?.id) setLastCreatedId(created.id);
      setForm(initialState);
      setSelectedFile(null);
    } catch (error) {
      setApiState('mock');
      setMessage(error.message || 'Preview saved in local mode. Connect the backend and Azure services for full persistence.');
    }
  }

  return (
    <AppLayout>
      <div className="page-shell">
        <section className="form-wrap">
          <div className="form-card">
            <p className="eyebrow">New Upload</p>
            <h1>Upload a photo and add details</h1>
            <p className="page-intro">
              Add the information viewers need to discover and understand your content.
            </p>

            <form className="upload-form" onSubmit={handleSubmit}>
              <label>
                Title
                <input name="title" value={form.title} onChange={handleChange} placeholder="Enter photo title" required />
              </label>
              <label>
                Caption
                <textarea name="caption" value={form.caption} onChange={handleChange} placeholder="Describe the photo" rows="4" required />
              </label>

              <div className="form-grid">
                <label>
                  Location
                  <input name="location" value={form.location} onChange={handleChange} placeholder="Enter location" required />
                </label>
                <label>
                  People Present
                  <input name="peoplePresent" value={form.peoplePresent} onChange={handleChange} placeholder="Names of people present" required />
                </label>
              </div>

              <div className="form-grid">
                <label>
                  Category
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option>Travel</option>
                    <option>Portrait</option>
                    <option>Nature</option>
                    <option>Urban</option>
                    <option>Events</option>
                  </select>
                </label>
                <label>
                  Image URL
                  <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Optional image URL fallback" />
                </label>
              </div>

              <label>
                Upload Image File
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </label>

              <button type="submit" className="btn btn-primary">
                {selectedFile ? 'Upload Photo File' : 'Publish Upload'}
              </button>
            </form>
          </div>

          <aside className="preview-card">
            <p className="eyebrow">Preview</p>
            <h2>{form.title || 'Untitled upload preview'}</h2>
            <p>{form.caption || 'Your caption preview will appear here.'}</p>

            <div className="meta-list">
              <span><strong>Location:</strong> {form.location || 'Not set'}</span>
              <span><strong>People:</strong> {form.peoplePresent || 'Not set'}</span>
              <span><strong>Category:</strong> {form.category}</span>
            </div>

            {localPreview ? (
              <img className="preview-image" src={localPreview} alt="Upload preview" />
            ) : form.imageUrl ? (
              <img className="preview-image" src={form.imageUrl} alt="Upload preview" />
            ) : (
              <div className="preview-placeholder">Image preview will appear here</div>
            )}

            {submitted && message && (
              <div className={apiState === 'success' ? 'notice success' : 'notice'}>
                {message}
              </div>
            )}

            {lastCreatedId && (
              <div className="notice success">
                Created photo ID: <strong>{lastCreatedId}</strong>. Refresh the gallery to see the newest item.
              </div>
            )}
          </aside>
        </section>
      </div>
    </AppLayout>
  );
}
