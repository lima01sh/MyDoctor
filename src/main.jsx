import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
// import './index.css'
import App from './App.jsx'
import "./index.css";
createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/service-ui/service-my-clinic/'>
    <App />
  </BrowserRouter>,
)
// production
// basename='/service-ui/service-my-clinic/'
// UAT
// basename='/vote/uatClinic/'