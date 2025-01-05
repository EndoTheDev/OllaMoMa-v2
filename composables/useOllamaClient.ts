import { Ollama } from 'ollama/browser'
import { useRuntimeConfig } from '#imports'

interface OllamaConfig {
  host: string
}

const defaultConfig: OllamaConfig = {
  host: 'http://localhost:11434'
}

export function useOllamaClient(config: Partial<OllamaConfig> = {}) {
  const runtimeConfig = useRuntimeConfig()
  const ollamaHost = runtimeConfig.public?.ollamaHost as string | undefined
  
  const mergedConfig: OllamaConfig = {
    ...defaultConfig,
    ...config,
    host: config.host || ollamaHost || defaultConfig.host
  }

  const client = new Ollama(mergedConfig)

  return client
} 