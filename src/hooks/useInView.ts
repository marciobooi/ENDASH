import { useEffect, useRef, useState } from 'react'

/**
 * True once the element has been on screen. Charts load only when a reader reaches them (old IntersectionObserver).
 * Where the browser has no IntersectionObserver, the element counts as seen at once.
 */
export function useInView<T extends Element>(): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null)
  const [seen, setSeen] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    if (seen || !ref.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { rootMargin: '600px 0px', threshold: 0 },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [seen])

  return [ref, seen]
}
