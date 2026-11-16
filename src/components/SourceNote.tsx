import { useTranslation } from 'react-i18next'
import { datasetUrl } from '../services/chartTheme'

interface SourceNoteProps {
  /** Code of the Eurostat dataset the chart draws (e.g. `nrg_ind_eff`). */
  dataset: string
}

/** "Source: Eurostat - access to dataset": where the figures of a table come from, with the link to them. */
export function SourceNote({ dataset }: SourceNoteProps) {
  const { t, i18n } = useTranslation()
  return (
    <p className="source-note">
      {t('labels.EXPORT_FOOTER_TITLE')} ({dataset}) -{' '}
      <a className="ecl-link" href={datasetUrl(dataset, i18n.resolvedLanguage ?? 'en')} target="_blank" rel="noopener">
        {t('labels.DB')}
        <span className="ecl-u-sr-only"> {t('source.newTab')}</span>
      </a>
    </p>
  )
}
