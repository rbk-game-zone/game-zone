import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import { store } from './store/store';
import './index.css'
import App from './App.tsx'
import { setCredentials } from './store/authSlice.ts';

// Check for existing token on app load
const token = localStorage.getItem('token');
if (token) {
  store.dispatch(setCredentials({ token }));
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>,
)
