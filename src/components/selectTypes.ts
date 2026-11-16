export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

/** A labelled group of options: `<optgroup>` in a native select, a `<fieldset>` in the multiple select. */
export interface SelectGroup {
  label: string
  options: SelectOption[]
}

export type SelectItem = SelectOption | SelectGroup

export function isSelectGroup(item: SelectItem): item is SelectGroup {
  return 'options' in item
}
