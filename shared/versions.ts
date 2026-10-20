import registry from './versions.json'
export interface DocsVersion { id: string; label: string; short: string; released: boolean; sourceRef: string }
export const versions: DocsVersion[] = registry.versions
export const defaultVersion = registry.defaultVersion
export const github = registry.github
