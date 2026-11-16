import type { ComponentPropsWithRef, ReactNode } from 'react'

interface ButtonOwnProps {
  /** ECL variant: primary (filled), secondary (outlined), tertiary (text). */
  variant?: 'primary' | 'secondary' | 'tertiary'
  /** White version for dark backgrounds (tertiary on the toolbar). */
  inverted?: boolean
  /** Icon shown before the label. */
  icon?: ReactNode
  /** The text of the button. */
  children?: ReactNode
  className?: string
}

type ButtonProps = ButtonOwnProps & Omit<ComponentPropsWithRef<'button'>, keyof ButtonOwnProps> & { href?: undefined }
type LinkProps = ButtonOwnProps & Omit<ComponentPropsWithRef<'a'>, keyof ButtonOwnProps> & { href: string }

/**
 * ECL button (`ecl-button`) with its container, icon and label markup. Pass `href` and it is a link that looks like a
 * button; otherwise it is a `<button type="button">`. Every other prop (onClick, aria-*, id, ref, data-*) is
 * forwarded, so one component covers every plain button of the tool. Icon-only round buttons: see RoundButton.
 */
export function Button(props: ButtonProps | LinkProps) {
  const { variant = 'primary', inverted = false, icon, children, className = '', ...rest } = props
  const classes = ['ecl-button', `ecl-button--${variant}`, inverted ? 'ecl-button--inverted' : '', className].filter(Boolean).join(' ')
  const content = (
    <span className="ecl-button__container">
      {icon}
      {children !== undefined && <span className="ecl-button__label" data-ecl-label="true">{children}</span>}
    </span>
  )

  if ('href' in rest && rest.href !== undefined) {
    return <a {...(rest as ComponentPropsWithRef<'a'>)} className={classes}>{content}</a>
  }
  const { type = 'button', ...buttonProps } = rest as ComponentPropsWithRef<'button'>
  return <button {...buttonProps} type={type} className={classes}>{content}</button>
}
