import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App.tsx';
import { persistor, store } from './redux/store.ts';
import './index.css';
import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <Toaster
          duration={2000}
          toastOptions={{
            style: {
              background: '#37352f',
              color: '#fff',
              fontWeight: 500,
              padding: '0.75rem 1rem',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
            },
          }}
        />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
