import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { 
  Upload, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Sparkles,
  Eye,
  Brain,
  Shield,
  FileWarning,
  Info
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAnalysisStore } from '../store/analysisStore'
import soundManager from '../utils/soundManager'

export default function Analyze() {
  const { analyzeImage, isAnalyzing, currentAnalysis } = useAnalysisStore()
  const [inputMethod, setInputMethod] = useState('upload') // 'upload' or 'url'
  const [imageUrl, setImageUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState(null)

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
      soundManager.playScan()
      toast.loading('Analyzing image...', { id: 'analyze' })
      
      const result = await analyzeImage(file)
      
      if (result.success) {
        soundManager.playReveal()
        toast.success('Analysis complete!', { id: 'analyze' })
      } else {
        soundManager.playError()
        toast.error('Analysis failed', { id: 'analyze' })
      }
    }
  }, [analyzeImage])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: isAnalyzing
  })

  const handleUrlAnalysis = async () => {
    if (!imageUrl.trim()) {
      toast.error('Please enter an image URL')
      return
    }

    setPreviewUrl(imageUrl)
    soundManager.playScan()
    toast.loading('Analyzing image...', { id: 'analyze' })
    
    const result = await analyzeImage(imageUrl)
    
    if (result.success) {
      toast.success('Analysis complete!', { id: 'analyze' })
    } else {
      toast.error('Analysis failed', { id: 'analyze' })
    }
  }

  const getVerdictConfig = (verdict) => {
    switch (verdict) {
      case 'authentic':
        return {
          icon: CheckCircle,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/20',
          border: 'border-emerald-500/30',
          gradient: 'from-emerald-500 to-green-600',
          label: 'Authentic'
        }
      case 'suspicious':
        return {
          icon: AlertTriangle,
          color: 'text-amber-400',
          bg: 'bg-amber-500/20',
          border: 'border-amber-500/30',
          gradient: 'from-amber-500 to-orange-600',
          label: 'Suspicious'
        }
      case 'fake':
        return {
          icon: XCircle,
          color: 'text-red-400',
          bg: 'bg-red-500/20',
          border: 'border-red-500/30',
          gradient: 'from-red-500 to-rose-600',
          label: 'Deepfake Detected'
        }
      default:
        return {
          icon: Info,
          color: 'text-gray-400',
          bg: 'bg-gray-500/20',
          border: 'border-gray-500/30',
          gradient: 'from-gray-500 to-gray-600',
          label: 'Unknown'
        }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Analyze Image</h1>
        <p className="text-gray-400 mt-2">Upload an image or paste a URL to check for deepfake manipulation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Method Toggle */}
          <div className="glass-card rounded-2xl p-2 inline-flex">
            <button
              onClick={() => setInputMethod('upload')}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                inputMethod === 'upload'
                  ? 'bg-gradient-to-r from-sky-500 to-violet-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Upload size={18} />
              Upload
            </button>
            <button
              onClick={() => setInputMethod('url')}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                inputMethod === 'url'
                  ? 'bg-gradient-to-r from-sky-500 to-violet-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LinkIcon size={18} />
              URL
            </button>
          </div>

          {/* Upload Area */}
          <AnimatePresence mode="wait">
            {inputMethod === 'upload' ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div
                  {...getRootProps()}
                  className={`glass-card rounded-2xl p-12 border-2 border-dashed transition-all cursor-pointer ${
                    isDragActive
                      ? 'border-sky-500 bg-sky-500/10'
                      : 'border-white/20 hover:border-white/40'
                  } ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <input {...getInputProps()} />
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-6">
                      {isAnalyzing ? (
                        <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
                      ) : (
                        <ImageIcon className="w-10 h-10 text-sky-400" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {isDragActive ? 'Drop your image here' : 'Drag & drop an image'}
                    </h3>
                    <p className="text-gray-400 mb-4">or click to browse</p>
                    <p className="text-sm text-gray-500">
                      Supports: JPEG, PNG, GIF, WebP (Max 10MB)
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="url"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card rounded-2xl p-8"
              >
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Image URL
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="input-field flex-1"
                      disabled={isAnalyzing}
                    />
                    <button
                      onClick={handleUrlAnalysis}
                      disabled={isAnalyzing || !imageUrl.trim()}
                      className="btn-primary flex items-center gap-2 disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Sparkles size={18} />
                      )}
                      Analyze
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Enter a direct link to an image from any website
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Preview */}
          {previewUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-4"
            >
              <p className="text-sm text-gray-400 mb-3">Preview</p>
              <div className="relative rounded-xl overflow-hidden bg-black/50">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-contain"
                  onError={() => {
                    toast.error('Failed to load image')
                    setPreviewUrl(null)
                  }}
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 text-sky-400 animate-spin mx-auto mb-4" />
                      <p className="text-white font-medium">Analyzing...</p>
                      <p className="text-gray-400 text-sm">Running deepfake detection</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {currentAnalysis ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Main Result */}
                <div className={`glass-card rounded-2xl p-8 border ${getVerdictConfig(currentAnalysis.verdict).border}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-4 rounded-2xl ${getVerdictConfig(currentAnalysis.verdict).bg}`}>
                      {(() => {
                        const VerdictIcon = getVerdictConfig(currentAnalysis.verdict).icon
                        return <VerdictIcon className={`w-8 h-8 ${getVerdictConfig(currentAnalysis.verdict).color}`} />
                      })()}
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${getVerdictConfig(currentAnalysis.verdict).color}`}>
                        {getVerdictConfig(currentAnalysis.verdict).label}
                      </h3>
                      <p className="text-gray-400">Analysis complete</p>
                    </div>
                  </div>

                  {/* Confidence Score Ring */}
                  <div className="flex items-center gap-8">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke={`url(#gradient-${currentAnalysis.verdict})`}
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${currentAnalysis.confidence * 3.52} 352`}
                          className="score-ring"
                        />
                        <defs>
                          <linearGradient id="gradient-authentic" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#059669" />
                          </linearGradient>
                          <linearGradient id="gradient-suspicious" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#d97706" />
                          </linearGradient>
                          <linearGradient id="gradient-fake" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#dc2626" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">{currentAnalysis.confidence}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Confidence Level</p>
                      <p className="text-white">
                        {currentAnalysis.confidence >= 90 ? 'Very High' :
                         currentAnalysis.confidence >= 70 ? 'High' :
                         currentAnalysis.confidence >= 50 ? 'Moderate' : 'Low'}
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        Processed in {currentAnalysis.processingTime}ms
                      </p>
                    </div>
                  </div>
                </div>

                {/* Analysis Details */}
                <div className="grid grid-cols-1 gap-4">
                  {[
                    {
                      icon: Eye,
                      title: 'Face Analysis',
                      score: currentAnalysis.details?.faceAnalysis?.score || 0,
                      items: currentAnalysis.details?.faceAnalysis?.inconsistencies || []
                    },
                    {
                      icon: FileWarning,
                      title: 'Metadata Analysis',
                      score: currentAnalysis.details?.metadataAnalysis?.score || 0,
                      items: currentAnalysis.details?.metadataAnalysis?.flags || []
                    },
                    {
                      icon: Brain,
                      title: 'AI Detection',
                      score: currentAnalysis.details?.aiDetection?.score || 0,
                      items: currentAnalysis.details?.aiDetection?.patterns || []
                    }
                  ].map((detail, index) => (
                    <motion.div
                      key={detail.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card rounded-xl p-5"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white/5">
                            <detail.icon className="w-5 h-5 text-sky-400" />
                          </div>
                          <span className="font-medium text-white">{detail.title}</span>
                        </div>
                        <span className={`text-sm font-semibold ${
                          detail.score >= 70 ? 'text-red-400' : 
                          detail.score >= 40 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {detail.score}% anomaly
                        </span>
                      </div>
                      {detail.items.length > 0 && (
                        <div className="space-y-2 mt-3 pt-3 border-t border-white/10">
                          {detail.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              {item}
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-2xl p-12 text-center"
              >
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-12 h-12 text-sky-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Ready to Analyze</h3>
                <p className="text-gray-400 max-w-sm mx-auto">
                  Upload an image or paste a URL to start deepfake detection analysis
                </p>
                <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI-Powered
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Face Detection
                  </div>
                  <div className="flex items-center gap-2">
                    <FileWarning className="w-4 h-4" />
                    Metadata Check
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
