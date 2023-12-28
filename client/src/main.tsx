import React from 'react';
import { createRoot } from 'react-dom/client'; // Correct import path
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // Handle the case where the 'root' element is not found
  console.error("Root element not found");
}

