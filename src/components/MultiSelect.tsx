import { useEffect, useId, useRef, useState } from 'react'
import { FieldLabel } from './FieldLabel'
import { isSelectGroup, type SelectItem, type SelectOption } from './selectTypes'
import { eclGlobal } from '../services/ecl'

export interface MultiSelectLabels {
  placeholder: string
  selectAll: string
  clearAll: string
  close: string
  search: string
  noResults: string
  /** Screen-reader text read before the counter number, e.g. "Selected:". */
  selected: string
  /** Screen-reader text before the number of visible options, e.g. "Options available:". */
  optionsAvailable: string
}

interface MultiSelectProps {
  label: string
  /** Options, or groups of options (rendered as `<fieldset>` + `<legend>`). */
  options: SelectItem[]
  values: string[]
  onChange: (values: string[]) => void
  labels: MultiSelectLabels
  helper?: string
  /** Error text; also marks the field as invalid. */
  error?: string
  disabled?: boolean
  required?: boolean
  /** Translated "(required)" text (e.g. `t('form.required')`). */
  requiredText?: string
  hideLabel?: boolean
  /** Field name: when set, every selected value is submitted with a form (hidden inputs). */
  name?: string
  width?: 's' | 'm' | 'l'
  /** Show the search box. Default: true when there are more than 8 options. */
  searchable?: boolean
  /** Show the "select all" checkbox. Default: true. */
  selectAll?: boolean
  id?: string
}

function Option({ option }: { option: SelectOption }) {
  return <option value={option.value} disabled={option.disabled}>{option.label}</option>
}

/**
 * ECL multiple select. The markup is the ECL reference (a native `<select multiple data-ecl-select-multiple>`) and
 * ECL's own widget builds the toggle, counter, search, "select all", checkboxes and keyboard handling on top of it,
 * so behaviour and accessibility are exactly ECL's. React only renders the native select and tells the widget to
 * start and stop; the selection is read back from the select's `change` event.
 *
 * The widget owns the selection once it runs: `values` are the initial values. Change `key` to start over with new
 * values (a new list of options or new labels rebuilds the widget by itself).
 */
export function MultiSelect({
  label,
  options,
  values,
  onChange,
  labels,
  helper,
  error,
  disabled = false,
  required = false,
  requiredText = '(required)',
  hideLabel = false,
  name,
  width = 'm',
  searchable,
  selectAll = true,
  id,
}: MultiSelectProps) {
  const generatedId = useId()
  const baseId = id ?? `multiselect-${generatedId}`
  const selectRef = useRef<HTMLSelectElement>(null)
  // Only the first values: afterwards the widget owns the selection, and React must not write over it.
  const [initialValues] = useState(values)
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  })

  const count = options.reduce((sum, item) => sum + (isSelectGroup(item) ? item.options.length : 1), 0)
  const showSearch = searchable ?? count > 8
  // The widget builds its DOM once from what is rendered, so anything it displays is part of the rebuild signature.
  const signature = JSON.stringify([options, labels, showSearch, selectAll, disabled, helper, error])

  useEffect(() => {
    const select = selectRef.current
    if (!select) return
    const widget = new (eclGlobal().Select)(select)
    widget.init()
    const report = () => onChangeRef.current(Array.from(select.selectedOptions, (option) => option.value))
    select.addEventListener('change', report)
    return () => {
      select.removeEventListener('change', report)
      widget.destroy()
    }
  }, [signature])

  const attributes: Record<string, string | boolean | undefined> = {
    'data-ecl-select-multiple': true,
    'data-ecl-select-default': labels.placeholder,
    'data-ecl-select-clear-all': labels.clearAll,
    'data-ecl-select-close': labels.close,
    'data-ecl-select-counter': labels.selected,
    'data-ecl-select-nb-options': labels.optionsAvailable,
    'data-ecl-select-all': selectAll ? labels.selectAll : undefined,
    'data-ecl-select-search': showSearch ? labels.search : undefined,
    'data-ecl-select-no-results': showSearch ? labels.noResults : undefined,
  }

  return (
    <div className="ecl-form-group" key={signature}>
      <FieldLabel id={`${baseId}-label`} htmlFor={baseId} label={label} required={required} requiredText={requiredText} hidden={hideLabel} />
      {helper && <div id={`${baseId}-helper`} className="ecl-help-block">{helper}</div>}
      {error && <div id={`${baseId}-error`} className="ecl-feedback-message">{error}</div>}
      <div className={`ecl-select__container ecl-select__container--${width}${error ? ' ecl-select__container--invalid' : ''}`}>
        <select
          ref={selectRef}
          id={baseId}
          name={name}
          className="ecl-select"
          multiple
          defaultValue={initialValues}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          {...attributes}
        >
          {options.map((item) =>
            isSelectGroup(item) ? (
              <optgroup key={item.label} label={item.label}>
                {item.options.map((option) => <Option key={option.value} option={option} />)}
              </optgroup>
            ) : (
              <Option key={item.value} option={item} />
            ),
          )}
        </select>
      </div>
    </div>
  )
}
