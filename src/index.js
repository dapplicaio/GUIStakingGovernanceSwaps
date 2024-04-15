import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { waxChain, waxAuthenticators } from './config/wax.config';
import { UALProvider } from 'ual-reactjs-renderer';
import reportWebVitals from './reportWebVitals';

import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <UALProvider
      chains={[waxChain]}
      authenticators={waxAuthenticators}
      appName="TestGame"
    >
      <App />
    </UALProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals(console.log);
