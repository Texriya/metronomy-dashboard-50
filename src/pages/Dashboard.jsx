import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  Sparkles,
  Activity,
  Clock,
  Zap
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useAnalysisStore } from '../store/analysisStore'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const { stats, analyses } = useAnalysisStore()

  // Mock chart data
  const weeklyData = [
    { name: 'Mon', scans: 12, fakes: 2 },
    { name: 'Tue', scans: 19, fakes: 4 },
    { name: 'Wed', scans: 15, fakes: 1 },
    { name: 'Thu', scans: 25, fakes: 6 },
    { name: 'Fri', scans: 32, fakes: 8 },
    { name: 'Sat', scans: 18, fakes: 3 },
    { name: 'Sun', scans: 22, fakes: 5 },
  ]

  const pieData = [
    { name: 'Authentic', value: stats.authenticCount || 45, color: '#10b981' },
    { name: 'Suspicious', value: stats.suspiciousCount || 30, color: '#f59e0b' },
    { name: 'Fake', value: stats.fakeCount || 25, color: '#ef4444' },
  ]

  const recentAnalyses = analyses.slice(0, 5)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'User'}</span>
          </h1>
          <p className="text-gray-400 mt-1">Here's what's happening with your scans today.</p>
        </div>
        <Link
          to="/analyze"
          className="btn-primary inline-flex items-center gap-2 self-start"
        >
          <Sparkles size={18} />
          New Analysis
          <ArrowRight size={18} />
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Total Scans',
            value: stats.totalScans || 156,
            change: '+12%',
            icon: Activity,
            color: 'from-sky-500 to-blue-600',
            bgColor: 'bg-sky-500/10'
          },
          {
            label: 'Authentic',
            value: stats.authenticCount || 98,
            change: '+8%',
            icon: CheckCircle,
            color: 'from-emerald-500 to-green-600',
            bgColor: 'bg-emerald-500/10'
          },
          {
            label: 'Suspicious',
            value: stats.suspiciousCount || 34,
            change: '-5%',
            icon: AlertTriangle,
            color: 'from-amber-500 to-orange-600',
            bgColor: 'bg-amber-500/10'
          },
          {
            label: 'Detected Fakes',
            value: stats.fakeCount || 24,
            change: '+3%',
            icon: XCircle,
            color: 'from-red-500 to-rose-600',
            bgColor: 'bg-red-500/10'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-2xl p-6 card-hover"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} text-transparent bg-clip-text`} style={{ color: stat.color.includes('sky') ? '#0ea5e9' : stat.color.includes('emerald') ? '#10b981' : stat.color.includes('amber') ? '#f59e0b' : '#ef4444' }} />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Weekly Activity</h3>
              <p className="text-sm text-gray-400">Scans vs Detected Fakes</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-sky-500" />
                <span className="text-gray-400">Scans</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-gray-400">Fakes</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFakes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="scans" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorScans)" />
              <Area type="monotone" dataKey="fakes" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorFakes)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Detection Breakdown</h3>
          <p className="text-sm text-gray-400 mb-4">Results distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-400">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Zap, label: 'Quick Scan', desc: 'Analyze an image', to: '/analyze', color: 'from-sky-500 to-blue-600' },
              { icon: Clock, label: 'View History', desc: 'Past analyses', to: '/history', color: 'from-violet-500 to-purple-600' },
              { icon: Shield, label: 'Extension', desc: 'Browser addon', to: '/settings', color: 'from-emerald-500 to-green-600' },
              { icon: TrendingUp, label: 'Reports', desc: 'Analytics', to: '/profile', color: 'from-amber-500 to-orange-600' },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-medium text-white">{action.label}</h4>
                <p className="text-xs text-gray-500 mt-1">{action.desc}</p>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Analyses */}
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Analyses</h3>
            <Link to="/history" className="text-sm text-sky-400 hover:text-sky-300 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          
          {recentAnalyses.length > 0 ? (
            <div className="space-y-3">
              {recentAnalyses.map((analysis, index) => (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
                    {analysis.imageUrl && (
                      <img src={analysis.imageUrl} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">Analysis #{analysis.id?.slice(-6)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(analysis.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    analysis.verdict === 'authentic' ? 'bg-emerald-500/20 text-emerald-400' :
                    analysis.verdict === 'suspicious' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {analysis.confidence}%
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-400">No analyses yet</p>
              <Link to="/analyze" className="text-sky-400 text-sm hover:text-sky-300 mt-2 inline-block">
                Start your first scan →
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
