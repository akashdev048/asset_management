import React from 'react';
import { BrowserRouter } from "react-router-dom"
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Store } from './Redux/Store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <BrowserRouter>
    <Provider store={Store}>
      <App />
    </Provider>
  </BrowserRouter>
</React.StrictMode>
);
