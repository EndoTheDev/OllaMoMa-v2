import { Ollama } from 'ollama/browser'
import { useSettingsStore } from '~/stores/settings'

interface OllamaConfig {
  host: string
}

export function useOllamaClient(config: Partial<OllamaConfig> = {}) {
  const settingsStore = useSettingsStore()
  
  const defaultConfig: OllamaConfig = {
    host: `http://${settingsStore.ollamaHost}:${settingsStore.ollamaPort}`
  }
  
  const mergedConfig: OllamaConfig = {
    ...defaultConfig,
    ...config
  }

  const client = new Ollama(mergedConfig)

  return client
}	