import { useId, type ComponentPropsWithRef, type ReactNode } from 'react'

interface CardOwnProps {
  title: string
  /** Heading level of the title, so the card fits the page outline. Default 3. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /** Line under the title (e.g. the unit of a chart). */
  description?: string
  /** Controls in the top-right corner (expand, toggles). */
  actions?: ReactNode
  /** Main content of the card. */
  children?: ReactNode
  /** Id of the title (the card is named by it). Default: generated. */
  titleId?: string
  /** Base of the class names: `chart-card` gives `chart-card`, `chart-card__header`, `chart-card__title`, ... Default `card`. */
  classBase?: string
}

type CardProps = CardOwnProps & Omit<ComponentPropsWithRef<'article'>, keyof CardOwnProps>

/**
 * Card: an `<article>` named by its title, with a header (title, description, actions) and the content below. Every
 * other prop (id, draggable, tabIndex, key handlers, ref) goes to the article, so a card can also be dragged and moved
 * with the keyboard. `classBase` lets one component serve different looks (the gallery's chart cards, the insight cards).
 */
export function Card({ title, headingLevel = 3, description, actions, children, titleId, classBase = 'card', className = '', ...articleProps }: CardProps) {
  const generatedId = useId()
  const headingId = titleId ?? generatedId
  const Heading = `h${headingLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  return (
    <article {...articleProps} className={`${classBase} ${className}`.trim()} aria-labelledby={headingId}>
      <header className={`${classBase}__header`}>
        <div>
          <Heading id={headingId} className={`${classBase}__title`}>{title}</Heading>
          {description && <p className={`${classBase}__unit`}>{description}</p>}
        </div>
        {actions && <div className={`${classBase}__actions`}>{actions}</div>}
      </header>
      {children}
    </article>
  )
}
