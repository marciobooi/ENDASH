import type { ReactNode } from 'react'
import { WebtoolsIcon } from './WebtoolsIcon'

type Variant = 'info' | 'success' | 'warning' | 'error'

const ICON: Record<Variant, string> = {
  info: 'info',
  success: 'check-circle',
  warning: 'warning',
  error: 'warning-circle',
}

interface NotificationProps {
  /** ECL variant: info (default), success, warning or error. */
  variant?: Variant
  /** Bold first line (optional). */
  title?: string
  children: ReactNode
  /** An error interrupts a screen reader (`alert`); the other variants are announced politely (`status`). */
  className?: string
}

/**
 * ECL notification (`ecl-notification`): the message box for errors, empty results and hints. Static markup only, no
 * ECL script needed (the close button is not offered: these messages describe the state of the page).
 */
export function Notification({ variant = 'info', title, children, className = '' }: NotificationProps) {
  return (
    <div className={`ecl-notification ecl-notification--${variant} ${className}`.trim()} role={variant === 'error' ? 'alert' : 'status'}>
      <WebtoolsIcon set="phosphor" name={ICON[variant]} className="ecl-notification__icon" />
      <div className="ecl-notification__content">
        {title && <div className="ecl-notification__title">{title}</div>}
        <div className="ecl-notification__description">{children}</div>
      </div>
    </div>
  )
}
