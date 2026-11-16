/**
 * Elements that must not appear in a screenshot: the share and download popovers, the tour overlay, and range sliders
 * (the capture library paints a slider's raw position as text; the label next to it already names the period).
 */
function isExcluded(element: Element): boolean {
  return (
    element.id === 'share-popover' ||
    element.id === 'download-popover' ||
    element.classList.contains('driver-overlay') ||
    element.matches('input[type="range"]')
  )
}

/** What the saved image carries around the capture: a title above, the source and the logo below. */
export interface ImageFrame {
  title: string
  /** Text at the bottom left ("Source: Eurostat"). */
  source: string
  /** Address of the logo, drawn at the bottom right. */
  logoSrc: string
}

const FONT = 'Arial, Helvetica, sans-serif'

const loadImage = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = src
  })

/** `text` shortened with an ellipsis until it fits `maxWidth` in the font the context is set to. */
function fitText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (context.measureText(text).width <= maxWidth) return text
  let shortened = text
  while (shortened.length > 1 && context.measureText(`${shortened}…`).width > maxWidth) shortened = shortened.slice(0, -1)
  return `${shortened}…`
}

/** The captured chart on a white page with the title on top and, at the bottom, the source (left) and logo (right). */
async function addFrame(chart: HTMLCanvasElement, frame: ImageFrame, scale: number): Promise<HTMLCanvasElement> {
  const margin = 20 * scale
  const headerHeight = 56 * scale
  const footerHeight = 48 * scale
  const logoHeight = 26 * scale

  const canvas = document.createElement('canvas')
  canvas.width = chart.width
  canvas.height = chart.height + headerHeight + footerHeight
  const context = canvas.getContext('2d')
  if (!context) return chart

  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(chart, 0, headerHeight)

  context.textBaseline = 'middle'
  context.fillStyle = '#004494'
  context.font = `bold ${20 * scale}px ${FONT}`
  context.fillText(fitText(context, frame.title, canvas.width - 2 * margin), margin, headerHeight / 2 + 4 * scale)

  const footerMiddle = headerHeight + chart.height + footerHeight / 2
  context.fillStyle = '#515560'
  context.font = `${14 * scale}px ${FONT}`
  context.fillText(frame.source, margin, footerMiddle)

  const logo = await loadImage(frame.logoSrc)
  if (logo) {
    const logoWidth = (logo.naturalWidth / logo.naturalHeight) * logoHeight
    context.drawImage(logo, canvas.width - margin - logoWidth, footerMiddle - logoHeight / 2, logoWidth, logoHeight)
  }
  return canvas
}

/**
 * Image of one element (a chart) as PNG or JPEG, at up to 2x resolution, with the title, source and logo around it
 * when a `frame` is given. Returns null when the capture fails.
 */
export async function captureElement(element: HTMLElement, type: 'image/png' | 'image/jpeg', frame?: ImageFrame): Promise<Blob | null> {
  try {
    const { default: html2canvas } = await import('html2canvas-pro')
    const scale = Math.min(window.devicePixelRatio || 1, 2)
    const canvas = await html2canvas(element, {
      // JPEG has no transparency: always paint a white background.
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      scale,
      // The frame writes the title, so the chart's own heading is left out (it would appear twice).
      ignoreElements: (node) => isExcluded(node) || (frame !== undefined && node.matches('[id$="-expanded-title"]')),
    })
    const result = frame ? await addFrame(canvas, frame, scale) : canvas
    return await new Promise<Blob | null>((resolve) => result.toBlob(resolve, type, 0.92))
  } catch {
    return null
  }
}

/**
 * Screenshot of what the user currently sees (the visible window, not the whole page) as a PNG.
 * The library is loaded on demand, so it costs nothing until someone uses it. Returns null when the capture fails.
 */
export async function captureViewport(): Promise<Blob | null> {
  try {
    const { default: html2canvas } = await import('html2canvas-pro')
    const canvas = await html2canvas(document.documentElement, {
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      x: window.scrollX,
      y: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
      scale: Math.min(window.devicePixelRatio || 1, 2),
      ignoreElements: isExcluded,
    })
    return await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  } catch {
    return null
  }
}

/** Put an image on the clipboard (Outlook and most mail clients paste it straight into the message). */
export async function copyImageToClipboard(image: Blob): Promise<boolean> {
  try {
    await navigator.clipboard.write([new ClipboardItem({ [image.type]: image })])
    return true
  } catch {
    return false
  }
}

/** Save an image as a file, for when the clipboard is not available. */
export function downloadImage(image: Blob, filename: string): void {
  const address = URL.createObjectURL(image)
  const link = document.createElement('a')
  link.href = address
  link.download = filename
  // Attached to the page and released later: some browsers cancel the save if the link or address goes away at once.
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  setTimeout(() => {
    link.remove()
    URL.revokeObjectURL(address)
  }, 10000)
}
