import { useEffect, useRef, type RefObject } from 'react'

/**
 * Calls `onOutside` when the pointer goes down outside `ref` while `active`. Listens in the capture phase, so the
 * callback runs before the browser moves focus to whatever was clicked.
 */
export function useOutsideClick(ref: RefObject<HTMLElement | null>, active: boolean, onOutside: () => void): void {
  const callback = useRef(onOutside)
  useEffect(() => {
    callback.current = onOutside
  })

  useEffect(() => {
    if (!active) return
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !ref.current?.contains(event.target)) callback.current()
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [ref, active])
}
