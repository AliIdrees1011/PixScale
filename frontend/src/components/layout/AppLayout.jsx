import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppLayout({ children }) {
  return (
    <div className="app-frame">
      <Navbar />
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  );
}
