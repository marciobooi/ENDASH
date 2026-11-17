import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { isAccessibilityMode } from './accessibility/mode'
import { site } from './config/toolConfig'

// One translation file per language in ./locales (en.json, fr.json, ...). The languages of the tool are listed in
// src/config/toolConfig.ts: to add one, add the file and an entry there.
const files = import.meta.glob<{ default: Record<string, unknown> }>('./locales/*.json', { eager: true })

const resources = Object.fromEntries(
  site.languages.map(({ code }) => {
    const file = files[`./locales/${code}.json`]
    if (!file) throw new Error(`Missing translation file src/locales/${code}.json (listed in site.languages).`)
    return [code, { translation: file.default }]
  }),
)

const supportedLanguages: string[] = site.languages.map(({ code }) => code)
const requestedLanguage = new URLSearchParams(window.location.search).get('language')
/** The language the person chose (the address), also on the statement page, whose own text is always English. */
export const userLanguage =
  requestedLanguage && supportedLanguages.includes(requestedLanguage) ? requestedLanguage : site.defaultLanguage

void i18n.use(initReactI18next).init({
  resources,
  // The accessibility statement is English only, whatever language was chosen.
  lng: isAccessibilityMode() ? 'en' : userLanguage,
  fallbackLng: site.defaultLanguage,
  supportedLngs: supportedLanguages,
  interpolation: { escapeValue: false },
})

// The address follows the language the person picks, so a reload or a shared link opens in it (not on the statement page).
if (!isAccessibilityMode()) {
  i18n.on('languageChanged', (language) => {
    const address = new URL(window.location.href)
    if (address.searchParams.get('language') === language) return
    address.searchParams.set('language', language)
    window.history.replaceState(window.history.state, '', address)
  })
}

export default i18n
