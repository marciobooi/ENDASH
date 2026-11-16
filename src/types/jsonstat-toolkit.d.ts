/** Typings of the JSON-stat reader used for the Eurostat tables (the package ships without them). */
declare module 'jsonstat-toolkit' {
  export interface JsonStatDimension {
    id: string[]
    label?: string
    category: { index: string[]; label?: Record<string, string> }
  }
  export interface JsonStatDataset {
    id: string[]
    value: Array<number | null>
    label?: string
    Dimension(name: string): { id: string[] } | null
    Data(filter: Record<string, string>): { value: number | null; status: string | null } | null
    __tree__: {
      label?: string
      dimension: Record<string, { category: { label?: Record<string, string>; index: Record<string, number> | string[] } }>
    }
  }
  export interface JsonStatCollection {
    Dataset(index: number): JsonStatDataset
  }
  export default function JSONstat(json: unknown): JsonStatCollection
}
