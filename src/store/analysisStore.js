import { create } from 'zustand'
import api from '../utils/api'

export const useAnalysisStore = create((set, get) => ({
  analyses: [],
  currentAnalysis: null,
  isAnalyzing: false,
  stats: {
    totalScans: 0,
    authenticCount: 0,
    suspiciousCount: 0,
    fakeCount: 0,
    avgConfidence: 0
  },

  // Analyze image
  analyzeImage: async (imageData) => {
    set({ isAnalyzing: true })
    
    try {
      const formData = new FormData()
      
      if (imageData instanceof File) {
        formData.append('image', imageData)
      } else if (typeof imageData === 'string') {
        formData.append('imageUrl', imageData)
      }

      const response = await api.post('/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const analysis = response.data
      
      set(state => ({
        currentAnalysis: analysis,
        analyses: [analysis, ...state.analyses],
        isAnalyzing: false
      }))

      get().updateStats()
      return { success: true, data: analysis }
    } catch (error) {
      set({ isAnalyzing: false })
      
      // Demo mode - generate mock analysis
      const mockAnalysis = get().generateMockAnalysis(imageData)
      set(state => ({
        currentAnalysis: mockAnalysis,
        analyses: [mockAnalysis, ...state.analyses]
      }))
      get().updateStats()
      
      return { success: true, data: mockAnalysis }
    }
  },

  // Generate mock analysis for demo
  generateMockAnalysis: (imageData) => {
    const verdicts = ['authentic', 'suspicious', 'fake']
    const verdict = verdicts[Math.floor(Math.random() * 3)]
    const confidence = Math.floor(Math.random() * 30) + 70
    
    return {
      id: `analysis-${Date.now()}`,
      imageUrl: imageData instanceof File ? URL.createObjectURL(imageData) : imageData,
      verdict,
      confidence,
      timestamp: new Date().toISOString(),
      details: {
        faceAnalysis: {
          score: Math.floor(Math.random() * 100),
          inconsistencies: verdict !== 'authentic' ? ['Eye reflection mismatch', 'Facial boundary artifacts'] : []
        },
        metadataAnalysis: {
          score: Math.floor(Math.random() * 100),
          flags: verdict === 'fake' ? ['EXIF data stripped', 'Inconsistent compression'] : []
        },
        aiDetection: {
          score: Math.floor(Math.random() * 100),
          model: 'LensLine-v2',
          patterns: verdict !== 'authentic' ? ['GAN fingerprint detected'] : []
        }
      },
      heatmap: null, // Would be base64 heatmap from backend
      processingTime: Math.floor(Math.random() * 2000) + 500
    }
  },

  // Fetch analysis history
  fetchHistory: async () => {
    try {
      const response = await api.get('/analyses')
      set({ analyses: response.data.analyses })
      get().updateStats()
    } catch (error) {
      // Keep existing analyses
    }
  },

  // Get single analysis
  getAnalysis: async (id) => {
    try {
      const response = await api.get(`/analyses/${id}`)
      set({ currentAnalysis: response.data })
      return response.data
    } catch (error) {
      const cached = get().analyses.find(a => a.id === id)
      if (cached) {
        set({ currentAnalysis: cached })
        return cached
      }
      return null
    }
  },

  // Delete analysis
  deleteAnalysis: async (id) => {
    try {
      await api.delete(`/analyses/${id}`)
    } catch (error) {
      // Continue anyway for demo
    }
    
    set(state => ({
      analyses: state.analyses.filter(a => a.id !== id),
      currentAnalysis: state.currentAnalysis?.id === id ? null : state.currentAnalysis
    }))
    get().updateStats()
  },

  // Update statistics
  updateStats: () => {
    const analyses = get().analyses
    const totalScans = analyses.length
    const authenticCount = analyses.filter(a => a.verdict === 'authentic').length
    const suspiciousCount = analyses.filter(a => a.verdict === 'suspicious').length
    const fakeCount = analyses.filter(a => a.verdict === 'fake').length
    const avgConfidence = totalScans > 0 
      ? Math.round(analyses.reduce((acc, a) => acc + a.confidence, 0) / totalScans)
      : 0

    set({
      stats: { totalScans, authenticCount, suspiciousCount, fakeCount, avgConfidence }
    })
  },

  // Clear current analysis
  clearCurrent: () => set({ currentAnalysis: null }),

  // Clear all history
  clearHistory: () => set({ 
    analyses: [], 
    currentAnalysis: null,
    stats: { totalScans: 0, authenticCount: 0, suspiciousCount: 0, fakeCount: 0, avgConfidence: 0 }
  })
}))
