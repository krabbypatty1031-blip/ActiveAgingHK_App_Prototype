import { create } from 'zustand'

type AdviceSource = 'deepseek' | 'openrouter' | 'local' | 'error'
type AIState = {
  advice: string | null
  updatedAt: string | null
  source: AdviceSource | null
  setAdvice: (advice: string, source?: AdviceSource) => void
  clearAdvice: () => void
}

const useAIStore = create<AIState>((set) => ({
  advice: null,
  updatedAt: null,
  source: null,
  setAdvice: (advice: string, source: AdviceSource = 'local') => set({ advice, source, updatedAt: new Date().toISOString() }),
  clearAdvice: () => set({ advice: null, updatedAt: null, source: null })
}))

export default useAIStore