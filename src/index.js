import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'primeflex/primeflex.css'
// // import 'primeflex/themes/vela-blue.css'
// import 'primeflex/themes/saga-blue.css'
// // import 'primeflex/themes/arya-blue.css'
import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.css'
import 'primereact/resources/themes/saga-blue/theme.css'
import App from './App';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);