interface SkeletonProps {
  /** `chart`: a chart-shaped placeholder; `cards`: a row of figure cards; `text`: a few lines of text. */
  variant?: 'chart' | 'cards' | 'text'
  /** Height in pixels of the `chart` placeholder (match the chart that will replace it, so nothing jumps). */
  height?: number
  /** Translated loading text, read by screen readers (the placeholder itself is hidden from them). */
  label: string
  className?: string
}

const BAR_HEIGHTS = [38, 62, 48, 78, 56, 70, 44] // percent: a fixed shape, so the placeholder never flickers

/**
 * Placeholder that holds the place of content while it loads (old `skeletonContainer`). It has the size of the final
 * content, so the page does not jump when the chart arrives. One polite live region carries the text for screen
 * readers; the shimmer stops for people who ask for reduced motion (see App.css).
 */
export function Skeleton({ variant = 'chart', height = 240, label, className = '' }: SkeletonProps) {
  return (
    <div className={`skeleton skeleton--${variant} ${className}`.trim()} role="status" aria-busy="true" style={variant === 'chart' ? { height } : undefined}>
      <span className="ecl-u-sr-only">{label}</span>
      <div className="skeleton__shape" aria-hidden="true">
        {variant === 'chart' && BAR_HEIGHTS.map((percent, index) => <span key={index} className="skeleton__bar" style={{ height: `${percent}%` }} />)}
        {variant === 'cards' && [0, 1, 2, 3].map((index) => <span key={index} className="skeleton__block skeleton__card" />)}
        {variant === 'text' && [100, 92, 64].map((width) => <span key={width} className="skeleton__block skeleton__line" style={{ width: `${width}%` }} />)}
      </div>
    </div>
  )
}
