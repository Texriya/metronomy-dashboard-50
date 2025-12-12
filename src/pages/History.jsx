import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Trash2,
  ExternalLink,
  ChevronDown,
  Image as ImageIcon,
  Clock,
  MoreVertical
} from 'lucide-react'
import { format } from 'date-fns'
import { useAnalysisStore } from '../store/analysisStore'
import toast from 'react-hot-toast'

export default function History() {
  const { analyses, deleteAnalysis, clearHistory } = useAnalysisStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterVerdict, setFilterVerdict] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const filteredAnalyses = useMemo(() => {
    let filtered = [...analyses]

    // Filter by verdict
    if (filterVerdict !== 'all') {
      filtered = filtered.filter(a => a.verdict === filterVerdict)
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    } else if (sortBy === 'confidence-high') {
      filtered.sort((a, b) => b.confidence - a.confidence)
    } else if (sortBy === 'confidence-low') {
      filtered.sort((a, b) => a.confidence - b.confidence)
    }

    return filtered
  }, [analyses, searchTerm, filterVerdict, sortBy])

  const handleDelete = async (id) => {
    await deleteAnalysis(id)
    toast.success('Analysis deleted')
    setSelectedAnalysis(null)
  }

  const handleClearAll = () => {
    clearHistory()
    toast.success('History cleared')
    setShowDeleteModal(false)
  }

  const getVerdictIcon = (verdict) => {
    switch (verdict) {
      case 'authentic':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />
      case 'suspicious':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />
      case 'fake':
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return null
    }
  }

  const getVerdictStyle = (verdict) => {
    switch (verdict) {
      case 'authentic':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'suspicious':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'fake':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Analysis History</h1>
          <p className="text-gray-400 mt-1">{analyses.length} total analyses</p>
        </div>
        {analyses.length > 0 && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="btn-secondary text-red-400 border-red-500/30 hover:bg-red-500/10 flex items-center gap-2 self-start"
          >
            <Trash2 size={18} />
            Clear History
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search analyses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12"
            />
          </div>

          {/* Verdict Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterVerdict}
              onChange={(e) => setFilterVerdict(e.target.value)}
              className="input-field pl-12 pr-10 appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="all">All Results</option>
              <option value="authentic">Authentic</option>
              <option value="suspicious">Suspicious</option>
              <option value="fake">Fake</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field pl-12 pr-10 appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="confidence-high">Confidence ↓</option>
              <option value="confidence-low">Confidence ↑</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {filteredAnalyses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredAnalyses.map((analysis, index) => (
              <motion.div
                key={analysis.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedAnalysis(analysis)}
                className="glass-card rounded-2xl overflow-hidden card-hover cursor-pointer group"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
                  {analysis.imageUrl ? (
                    <img
                      src={analysis.imageUrl}
                      alt="Analysis"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-gray-600" />
                    </div>
                  )}
                  
                  {/* Verdict Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold border ${getVerdictStyle(analysis.verdict)}`}>
                    <div className="flex items-center gap-1.5">
                      {getVerdictIcon(analysis.verdict)}
                      <span className="capitalize">{analysis.verdict}</span>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="btn-primary flex items-center gap-2">
                      <ExternalLink size={16} />
                      View Details
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">
                      #{analysis.id.slice(-8)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(analysis.id)
                      }}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Confidence Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-400">Confidence</span>
                      <span className="text-white font-semibold">{analysis.confidence}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${analysis.confidence}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`h-full rounded-full ${
                          analysis.verdict === 'authentic' ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
                          analysis.verdict === 'suspicious' ? 'bg-gradient-to-r from-amber-500 to-orange-400' :
                          'bg-gradient-to-r from-red-500 to-rose-400'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={14} />
                    {format(new Date(analysis.timestamp), 'MMM d, yyyy • h:mm a')}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-2xl p-16 text-center"
        >
          <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">
            <ImageIcon className="w-12 h-12 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No analyses found</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            {searchTerm || filterVerdict !== 'all' 
              ? 'Try adjusting your filters to find what you\'re looking for'
              : 'Start analyzing images to build your history'
            }
          </p>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-2xl p-8 max-w-md w-full"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-2">Clear All History?</h3>
              <p className="text-gray-400 text-center mb-8">
                This action cannot be undone. All {analyses.length} analyses will be permanently deleted.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-all"
                >
                  Delete All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedAnalysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedAnalysis(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-2xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Image */}
              <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900">
                {selectedAnalysis.imageUrl && (
                  <img
                    src={selectedAnalysis.imageUrl}
                    alt="Analysis"
                    className="w-full h-full object-contain"
                  />
                )}
                <button
                  onClick={() => setSelectedAnalysis(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
                >
                  <XCircle size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Analysis Details</h2>
                    <p className="text-gray-400">#{selectedAnalysis.id}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${getVerdictStyle(selectedAnalysis.verdict)}`}>
                    <div className="flex items-center gap-2">
                      {getVerdictIcon(selectedAnalysis.verdict)}
                      <span className="capitalize">{selectedAnalysis.verdict}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="glass rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1">Confidence</p>
                    <p className="text-2xl font-bold text-white">{selectedAnalysis.confidence}%</p>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1">Processing Time</p>
                    <p className="text-2xl font-bold text-white">{selectedAnalysis.processingTime}ms</p>
                  </div>
                </div>

                <div className="glass rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-400 mb-1">Analyzed On</p>
                  <p className="text-white">
                    {format(new Date(selectedAnalysis.timestamp), 'MMMM d, yyyy \'at\' h:mm a')}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleDelete(selectedAnalysis.id)}
                    className="btn-secondary text-red-400 border-red-500/30 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedAnalysis(null)}
                    className="btn-primary flex-1"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
