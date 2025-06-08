import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './ecl.css' // Import ECL CSS
import './assets/css/font-awesome.css' // Import Font Awesome CSS
import './assets/css/custom-styles.css' // Import Custom Styles
import { AppProvider } from './context/AppContext'; // Import AppProvider
// ECL import and autoInit moved to App.jsx

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
)
