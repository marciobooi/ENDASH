import { useState, type ReactNode } from 'react'
import { Button } from './Button'
import { useTranslation } from 'react-i18next'
import { ToolbarIcon } from './ToolbarIcon'

export interface SubNavMenuItem {
  label: string
  href: string
}

interface SiteSubNavigationProps {
  title: string
  subtitle?: string
  /** Links shown in the menu panel opened by the Menu button. */
  menuItems?: SubNavMenuItem[]
  /** Form controls shown in the same panel, e.g. <Select … /> and <MultiSelect … />. */
  filters?: ReactNode
  /** Round action buttons shown on the right, e.g. <RoundButton icon="share" … />. */
  actions?: ReactNode
}

export function SiteSubNavigation({ title, subtitle, menuItems, filters, actions }: SiteSubNavigationProps) {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const hasMenu = Boolean(menuItems?.length || filters)

  return (
    <div id="overview" className="site-subnavigation" role="region" aria-label={t('toolbar.label')}>
      <div className="tool-toolbar">
        {hasMenu && (
          <Button
            id="menu-toggle"
            className="menu-toggle"
            variant="tertiary"
            inverted
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            icon={<ToolbarIcon name="menu" />}
          >
            {t('navigation.menu')}
          </Button>
        )}
        <div className="toolbar-title">
          <strong>{title}</strong>
          {subtitle && <span>{subtitle}</span>}
        </div>
        {actions && (
          <div className="toolbar-actions" role="group" aria-label={t('toolbar.label')}>
            {actions}
          </div>
        )}
      </div>
      {hasMenu && (
        <div id="main-navigation" className="tool-menu" hidden={!menuOpen}>
          {menuItems && menuItems.length > 0 && (
            <nav className="tool-menu-links" aria-label={t('navigation.label')}>
              {menuItems.map(({ label, href }) => (
                <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
              ))}
            </nav>
          )}
          {filters && (
            <div className="tool-menu-filters" role="group" aria-label={t('menu.filters')}>
              {filters}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
