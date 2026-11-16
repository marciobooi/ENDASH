import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@ecl/preset-eu/dist/scripts/ecl-esm-eu.js' // registers window.ECL
import './i18n'
import { applyColorCssVariables } from './config/toolConfig'
import { initEclTooltips } from './services/ecl'
import './index.css'
import App from './App'
import { isAccessibilityMode } from './accessibility/mode'
import { isEmbedMode } from './embed/embed'
import { isInsightsMode } from './insights/mode'
import { InsightsPage } from './pages/InsightsPage'
import { AccessibilityPage } from './pages/AccessibilityPage'
import { EmbedPage } from './pages/EmbedPage'

applyColorCssVariables()
initEclTooltips()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isEmbedMode() ? <EmbedPage /> : isAccessibilityMode() ? <AccessibilityPage /> : isInsightsMode() ? <InsightsPage /> : <App />}
  </StrictMode>,
)
