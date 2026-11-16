import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/Button'
import { SiteFooter } from '../components/Footer'
import { InsightsContent } from '../components/InsightsContent'
import { SiteNavigation } from '../components/Nav'
import { useSiteShell } from '../hooks/useSiteShell'
import { toolHrefFromInsights } from '../insights/mode'
import { filterParams } from '../state/filters'
import { readUrlState } from '../state/urlState'
import '../App.css'

/**
 * `?insights`: the same app shell (banner + footer) with the global insights instead of the tool, like the accessibility
 * statement. The selection of the tool (the country) comes from the address; nothing is changed here.
 */
export function InsightsPage() {
  const { t } = useTranslation()
  useSiteShell()
  // Read once: the page changes nothing, and a new object on every render would look like a new selection.
  const values = useMemo(() => readUrlState(filterParams), [])

  useEffect(() => {
    document.title = `${t('insights.title')} - ${t('brand')} - Eurostat`
  }, [t])

  return (
    <>
      <SiteNavigation title={t('brand')} />
      <main id="main-content" className="visualization-shell">
        <div className="global-insights-page">
          <div className="global-insights-page__bar">
            <h2 className="global-insights-page__title" id="insights-page-title">{t('insights.title')}</h2>
            <Button variant="secondary" href={toolHrefFromInsights()}>{t('insights.back')}</Button>
          </div>
          <InsightsContent geo={String(values.geo)} active />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
