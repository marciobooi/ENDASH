import { useEffect, useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react'
import { Tooltip } from './Tooltip'
import { ToolbarIcon, type ToolbarIconName } from './ToolbarIcon'

interface RoundButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> {
  /** Icon from the toolbar icon set. */
  icon: ToolbarIconName
  /** Accessible name; also used as the tooltip text unless `tooltip` is given. */
  label: string
  /** Tooltip text. Pass `false` to disable the tooltip. */
  tooltip?: string | false
  /** ECL button variant. `primary` (default) = filled blue, `secondary` = white with blue border. */
  variant?: 'secondary' | 'primary'
  /** Render as a link (navigation) instead of a button. */
  href?: string
}

/**
 * Circular icon-only button built on the ECL button
 * (keeps ECL's hover / focus / active / disabled states).
 */
export function RoundButton({
  icon,
  label,
  tooltip,
  variant = 'primary',
  href,
  className = '',
  type = 'button',
  ...buttonProps
}: RoundButtonProps) {
  const classes =
    `round-button ecl-button ecl-button--${variant} ecl-button--icon-only ${className}`.trim()

  // ECL copies the tooltip text when it opens; a button that changes its label while its tooltip is open updates it here.
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null)
  useEffect(() => {
    const id = ref.current?.getAttribute('aria-describedby')
    const popup = id ? document.getElementById(id) : null
    if (popup) popup.textContent = tooltip ?? label
  }, [label, tooltip])

  const content = (
    <span className="ecl-button__container">
      <span key={icon} className="round-button__icon"><ToolbarIcon name={icon} /></span>
      <span className="ecl-button__label" data-ecl-label="true">{label}</span>
    </span>
  )

  // A link has no `disabled`; every other prop (onClick, data-*, aria-*, id) is forwarded.
  const { disabled, ...linkProps } = buttonProps
  const control = href ? (
    <a ref={ref} {...(linkProps as AnchorHTMLAttributes<HTMLAnchorElement>)} href={href} className={classes} aria-label={label}>
      {content}
    </a>
  ) : (
    <button ref={ref} {...buttonProps} disabled={disabled} type={type} className={classes} aria-label={label}>
      {content}
    </button>
  )

  if (tooltip === false) return control
  return <Tooltip content={tooltip ?? label}>{control}</Tooltip>
}
