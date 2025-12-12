import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Calendar,
  Shield,
  Award,
  Camera,
  Edit3,
  Save,
  X,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Zap,
  Crown
} from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { useAnalysisStore } from '../store/analysisStore'

export default function Profile() {
  const { user, updateProfile } = useAuthStore()
  const { stats } = useAnalysisStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const result = await updateProfile(formData)
    if (result.success) {
      toast.success('Profile updated')
      setIsEditing(false)
    } else {
      toast.error(result.error || 'Update failed')
    }
    setSaving(false)
  }

  const achievements = [
    { 
      icon: Shield, 
      title: 'First Scan', 
      desc: 'Complete your first analysis',
      unlocked: stats.totalScans > 0,
      color: 'from-sky-500 to-blue-600'
    },
    { 
      icon: Activity, 
      title: 'Detective', 
      desc: 'Detect 10 fake images',
      unlocked: stats.fakeCount >= 10,
      color: 'from-violet-500 to-purple-600'
    },
    { 
      icon: TrendingUp, 
      title: 'Power User', 
      desc: 'Complete 100 analyses',
      unlocked: stats.totalScans >= 100,
      color: 'from-emerald-500 to-green-600'
    },
    { 
      icon: Zap, 
      title: 'Speed Demon', 
      desc: 'Analyze 10 images in one day',
      unlocked: false,
      color: 'from-amber-500 to-orange-600'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-sky-500 via-violet-500 to-pink-500 relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0f172a] to-transparent" />
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-8 -mt-16 relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            {/* Avatar */}
            <div className="flex items-end gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center text-5xl font-bold text-white shadow-glow border-4 border-[#0f172a]">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <button className="absolute bottom-2 right-2 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              
              <div className="mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field text-xl font-bold py-2"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-white">{user?.name || 'User'}</h1>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user?.plan === 'pro' 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {user?.plan === 'pro' ? (
                      <span className="flex items-center gap-1">
                        <Crown size={12} />
                        Pro Plan
                      </span>
                    ) : 'Free Plan'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Edit3 size={18} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Scans', value: stats.totalScans || user?.totalScans || 0, icon: Activity, color: 'text-sky-400' },
          { label: 'Authentic', value: stats.authenticCount || 0, icon: CheckCircle, color: 'text-emerald-400' },
          { label: 'Suspicious', value: stats.suspiciousCount || 0, icon: AlertTriangle, color: 'text-amber-400' },
          { label: 'Fake Detected', value: stats.fakeCount || 0, icon: XCircle, color: 'text-red-400' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-xl p-5 text-center"
          >
            <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Account Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Account Details</h2>
          
          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <User size={16} />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                />
              ) : (
                <p className="text-white">{user?.name || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Mail size={16} />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="input-field"
                />
              ) : (
                <p className="text-white">{user?.email || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Calendar size={16} />
                Member Since
              </label>
              <p className="text-white">
                {user?.joinedAt 
                  ? format(new Date(user.joinedAt), 'MMMM d, yyyy')
                  : format(new Date(), 'MMMM d, yyyy')
                }
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Shield size={16} />
                Account Type
              </label>
              <div className="flex items-center gap-3">
                <p className="text-white capitalize">{user?.plan || 'Free'} Plan</p>
                {user?.plan !== 'pro' && (
                  <button className="text-sm text-sky-400 hover:text-sky-300 font-medium">
                    Upgrade →
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Achievements</h2>
            <span className="text-sm text-gray-400">
              {achievements.filter(a => a.unlocked).length}/{achievements.length} unlocked
            </span>
          </div>
          
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  achievement.unlocked
                    ? 'bg-white/5'
                    : 'bg-white/[0.02] opacity-50'
                }`}
              >
                <div className={`p-3 rounded-xl ${
                  achievement.unlocked
                    ? `bg-gradient-to-br ${achievement.color}`
                    : 'bg-gray-800'
                }`}>
                  <achievement.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{achievement.title}</h4>
                  <p className="text-sm text-gray-500">{achievement.desc}</p>
                </div>
                {achievement.unlocked && (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6 border border-red-500/20"
      >
        <h2 className="text-xl font-semibold text-red-400 mb-2">Danger Zone</h2>
        <p className="text-gray-400 text-sm mb-6">
          These actions are irreversible. Please proceed with caution.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all font-medium">
            Export All Data
          </button>
          <button className="px-6 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all font-medium">
            Delete Account
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
