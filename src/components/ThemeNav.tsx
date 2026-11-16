import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { themes } from '../config/toolConfig'
import { eclGlobal } from '../services/ecl'
import { ToolbarIcon } from './ToolbarIcon'

/** Pixels below the sticky row at which a theme counts as "current" (the old tool's value). */
const SPY_MARGIN_PX = 150

/**
 * The "Energy topics" row of the old tool, built on ECL's InpageNavigation: ECL's own script does the scroll spy (the
 * active link), the collapsible "Page contents" button on narrow screens and the keyboard behaviour. It is laid out
 * as a full-width sticky row instead of ECL's sidebar (see the `#themeNav` rules in App.css).
 *
 * Before ECL's scroll spy activates anything (the page opens above the first theme), the first link is marked with
 * `data-default-active`, so the row never shows nothing selected. A data attribute, not a class: React must never
 * rewrite the class list that ECL's script maintains.
 */
export function ThemeNav({ visible }: { visible: boolean }) {
  const { t } = useTranslation()
  const navRef = useRef<HTMLElement>(null)
  const [spyStarted, setSpyStarted] = useState(false)
  const first = themes[0]

  useEffect(() => {
    const nav = navRef.current
    if (!visible || !nav) return
    const widget = new (eclGlobal().InpageNavigation)(nav, { spyOffset: Math.ceil(nav.getBoundingClientRect().height) + SPY_MARGIN_PX })
    widget.init()
    const onActivate = () => setSpyStarted(true)
    document.addEventListener('gumshoeActivate', onActivate, { once: true })
    return () => {
      document.removeEventListener('gumshoeActivate', onActivate)
      widget.destroy()
    }
  }, [visible])

  if (!visible || !first) return null
  return (
    <nav
      id="themeNav"
      ref={navRef}
      className="ecl-inpage-navigation ecl-inpage-navigation--visible"
      data-ecl-inpage-navigation
      aria-labelledby="themeNav-title"
    >
      <div id="themeNav-title" className="ecl-inpage-navigation__title">{t('labels.THEME_NAV_LABEL')}</div>
      <div className="ecl-inpage-navigation__body">
        <div className="ecl-inpage-navigation__trigger-wrapper">
          <button
            type="button"
            id="themeNav-trigger"
            className="ecl-inpage-navigation__trigger"
            data-ecl-inpage-navigation-trigger
            aria-controls="themeNav-list"
            aria-expanded="false"
          >
            <span className="ecl-inpage-navigation__trigger-current" data-ecl-inpage-navigation-trigger-current>
              {t(`labels.${first.labelKey}`)}
            </span>
            <span className="ecl-inpage-navigation__trigger-icon">
              <ToolbarIcon name="caret-down" />
            </span>
          </button>
        </div>
        <ul id="themeNav-list" className="ecl-inpage-navigation__list" data-ecl-inpage-navigation-list>
          {themes.map((theme) => (
            <li key={theme.id} className="ecl-inpage-navigation__item" data-default-active={theme.id === first.id && !spyStarted ? '' : undefined}>
              <a href={`#${theme.id}`} className="ecl-link ecl-inpage-navigation__link" data-ecl-inpage-navigation-link>
                {t(`labels.${theme.labelKey}`)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
