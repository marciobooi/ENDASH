import { useTranslation } from 'react-i18next'
import { site, images } from '../config/toolConfig'
import { LanguageSelector } from './LanguageSelector'

interface SiteNavigationProps {
  title: string
  /** The language button. Hidden on pages that exist in one language only (the accessibility statement). */
  showLanguage?: boolean
}

export function SiteNavigation({ title, showLanguage = true }: SiteNavigationProps) {
  const { t } = useTranslation()

  return (
    <>
      <a className="ecl-link ecl-link--standalone ecl-skip-link" href="#main-content">{t('navigation.skip')}</a>
      <header id="top" className="site-header">
        <div id="euGlobanContainer" />
        <div className="site-header-main">
          <h1 className="site-header-title">{title}</h1>
          {showLanguage ? <LanguageSelector /> : <span />}
          <img className="header-ribbon" src={images.headerRibbon.src} alt="" />
          <a
            className="eurostat-brand"
            href={site.links.home}
            aria-label={t('navigation.eurostatHome')}
            target="_blank"
            rel="noopener"
          >
            <img src={images.eurostatLogo.src} alt={t('navigation.eurostatHome')} />
          </a>
        </div>
      </header>
    </>
  )
}
