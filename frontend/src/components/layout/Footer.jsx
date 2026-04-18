import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <p className="site-footer__title">PixScale</p>
          <p className="site-footer__text">
            Share, discover, and manage photo content in one modern workspace.
          </p>
        </div>
        <div className="site-footer__meta">
          <span>Creators</span>
          <span>Viewers</span>
          <span>Smart media tools</span>
        </div>
      </div>
    </footer>
  );
}
