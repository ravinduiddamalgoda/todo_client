import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import App from './App';
import './index.css';
import { AuthProviderComponent } from './components/AuthProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SnackbarProvider>
      <BrowserRouter>
        <AuthProviderComponent>
          <App />
        </AuthProviderComponent>
      </BrowserRouter>
    </SnackbarProvider>
  </React.StrictMode>
);
