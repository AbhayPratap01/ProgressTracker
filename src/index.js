import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './App.css';

const container = document.getElementById('root') || document.createElement('div');
if (!container.id) {
  container.id = 'root';
  document.body.appendChild(container);
}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
