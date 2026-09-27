import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { installFetchWrapper } from './lib/mockFetch';
import './index.css';
import App from './App.jsx';

// Install the custom fetch wrapper to simulate network latency
installFetchWrapper();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
