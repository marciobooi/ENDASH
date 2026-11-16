import { cloneElement, type HTMLAttributes, type ReactElement } from 'react'

interface TooltipProps {
  content: string
  /** White bubble instead of the default dark one (ECL's inverted tooltip). */
  inverted?: boolean
  children: ReactElement<HTMLAttributes<HTMLElement>>
}

/**
 * Tooltip of the Europa Component Library. The trigger only needs `data-ecl-tooltip`: ECL's widget (started once by
 * initEclTooltips, src/services/ecl.ts) builds the bubble as a popover in the browser's top layer, so it is never
 * hidden behind the header or a sticky row, and handles hover, keyboard focus, Escape, scrolling and positioning.
 */
export function Tooltip({ content, inverted = false, children }: TooltipProps) {
  return cloneElement(children, { [inverted ? 'data-ecl-tooltip-inverted' : 'data-ecl-tooltip']: content } as HTMLAttributes<HTMLElement>)
}
