import { WebtoolsIcon } from './WebtoolsIcon'

/**
 * Every icon of the toolbar comes from the Webtools Phosphor set (`wt-icon-phosphor--<name>`, see WebtoolsIcon).
 * The key is the name used in the code; the value is the name in the Webtools set.
 * Names checked against the Webtools showcase icon list (https://webtools.europa.eu/showcase/demo/?comp=icons).
 */
const WEBTOOLS_ICONS = {
  'caret-down': 'caret-down',
  check: 'check',
  close: 'x',
  menu: 'list',
  refresh: 'arrows-clockwise',
  info: 'info',
  download: 'download-simple',
  share: 'share-network',
  embed: 'code',
  'arrow-up': 'arrow-up',
  'arrow-down': 'arrow-down',
  help: 'question',
  lightbulb: 'lightbulb',
  'chart-bar': 'chart-bar',
  'chart-pie': 'chart-pie',
  'chart-line': 'chart-line',
  table: 'table',
  'file-xls': 'file-xls',
  percent: 'percent',
  swap: 'arrows-left-right',
  expand: 'arrows-out',
  copy: 'copy',
  search: 'magnifying-glass',
  settings: 'gear',
} as const

export type ToolbarIconName = keyof typeof WEBTOOLS_ICONS

export function ToolbarIcon({ name, className = '' }: { name: ToolbarIconName; className?: string }) {
  return <WebtoolsIcon set="phosphor" name={WEBTOOLS_ICONS[name]} className={`toolbar-icon ${className}`.trim()} />
}
