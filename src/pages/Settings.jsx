import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette,
  Monitor,
  Moon,
  Sun,
  Globe,
  Download,
  Trash2,
  Save,
  Chrome,
  Zap,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  HelpCircle,
  ExternalLink
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      analysisComplete: true,
      weeklyReport: false,
      securityAlerts: true
    },
    privacy: {
      storeHistory: true,
      shareAnalytics: false,
      autoDelete: '30days'
    },
    appearance: {
      theme: 'dark',
      compactMode: false,
      animations: true
    },
    extension: {
      autoAnalyze: false,
      contextMenu: true,
      floatingButton: true,
      socialMedia: true
    }
  })

  const [saving, setSaving] = useState(false)

  const handleToggle = (category, key) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key]
      }
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Settings saved successfully')
    setSaving(false)
  }

  const Toggle = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-all ${
        enabled ? 'bg-gradient-to-r from-sky-500 to-violet-500' : 'bg-gray-700'
      }`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
        enabled ? 'left-7' : 'left-1'
      }`} />
    </button>
  )

  const SettingRow = ({ icon: Icon, title, description, children }) => (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-white/5">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <h4 className="text-white font-medium">{title}</h4>
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">Manage your preferences and configuration</p>
        </div>
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
          Save Changes
        </button>
      </div>

      {/* Notification Settings */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-sky-500/20">
            <Bell className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
            <p className="text-sm text-gray-400">Configure how you receive alerts</p>
          </div>
        </div>

        <div className="space-y-1">
          <SettingRow
            icon={Bell}
            title="Email Notifications"
            description="Receive updates via email"
          >
            <Toggle 
              enabled={settings.notifications.email}
              onChange={() => handleToggle('notifications', 'email')}
            />
          </SettingRow>
          <SettingRow
            icon={Zap}
            title="Push Notifications"
            description="Browser push notifications"
          >
            <Toggle 
              enabled={settings.notifications.push}
              onChange={() => handleToggle('notifications', 'push')}
            />
          </SettingRow>
          <SettingRow
            icon={Shield}
            title="Analysis Complete"
            description="Notify when analysis finishes"
          >
            <Toggle 
              enabled={settings.notifications.analysisComplete}
              onChange={() => handleToggle('notifications', 'analysisComplete')}
            />
          </SettingRow>
          <SettingRow
            icon={SettingsIcon}
            title="Weekly Reports"
            description="Weekly summary of your activity"
          >
            <Toggle 
              enabled={settings.notifications.weeklyReport}
              onChange={() => handleToggle('notifications', 'weeklyReport')}
            />
          </SettingRow>
        </div>
      </motion.section>

      {/* Privacy Settings */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-violet-500/20">
            <Shield className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Privacy & Data</h2>
            <p className="text-sm text-gray-400">Control your data and privacy</p>
          </div>
        </div>

        <div className="space-y-1">
          <SettingRow
            icon={Globe}
            title="Store Analysis History"
            description="Save your analysis results locally"
          >
            <Toggle 
              enabled={settings.privacy.storeHistory}
              onChange={() => handleToggle('privacy', 'storeHistory')}
            />
          </SettingRow>
          <SettingRow
            icon={Monitor}
            title="Share Analytics"
            description="Help improve LensLine with anonymous data"
          >
            <Toggle 
              enabled={settings.privacy.shareAnalytics}
              onChange={() => handleToggle('privacy', 'shareAnalytics')}
            />
          </SettingRow>
          <SettingRow
            icon={Trash2}
            title="Auto-Delete History"
            description="Automatically delete old analyses"
          >
            <select
              value={settings.privacy.autoDelete}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                privacy: { ...prev.privacy, autoDelete: e.target.value }
              }))}
              className="input-field w-auto py-2 px-4 text-sm"
            >
              <option value="never">Never</option>
              <option value="7days">After 7 days</option>
              <option value="30days">After 30 days</option>
              <option value="90days">After 90 days</option>
            </select>
          </SettingRow>
        </div>
      </motion.section>

      {/* Extension Settings */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-emerald-500/20">
            <Chrome className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Browser Extension</h2>
            <p className="text-sm text-gray-400">Configure the Chrome extension behavior</p>
          </div>
        </div>

        <div className="space-y-1">
          <SettingRow
            icon={Zap}
            title="Auto-Analyze Images"
            description="Automatically scan images on page load"
          >
            <Toggle 
              enabled={settings.extension.autoAnalyze}
              onChange={() => handleToggle('extension', 'autoAnalyze')}
            />
          </SettingRow>
          <SettingRow
            icon={Monitor}
            title="Context Menu"
            description="Right-click menu to analyze images"
          >
            <Toggle 
              enabled={settings.extension.contextMenu}
              onChange={() => handleToggle('extension', 'contextMenu')}
            />
          </SettingRow>
          <SettingRow
            icon={Globe}
            title="Social Media Support"
            description="Enable on Instagram, Twitter, Facebook, etc."
          >
            <Toggle 
              enabled={settings.extension.socialMedia}
              onChange={() => handleToggle('extension', 'socialMedia')}
            />
          </SettingRow>
        </div>

        {/* Extension Download */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-sky-500/10 to-violet-500/10 border border-sky-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Chrome className="w-8 h-8 text-sky-400" />
              <div>
                <h4 className="text-white font-medium">Get the Browser Extension</h4>
                <p className="text-sm text-gray-400">Analyze images directly from any website</p>
              </div>
            </div>
            <button className="btn-primary flex items-center gap-2">
              <Download size={18} />
              Install
            </button>
          </div>
        </div>
      </motion.section>

      {/* Appearance Settings */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-amber-500/20">
            <Palette className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Appearance</h2>
            <p className="text-sm text-gray-400">Customize the look and feel</p>
          </div>
        </div>

        {/* Theme Selector */}
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-3">Theme</p>
          <div className="flex gap-4">
            {[
              { id: 'light', icon: Sun, label: 'Light' },
              { id: 'dark', icon: Moon, label: 'Dark' },
              { id: 'system', icon: Monitor, label: 'System' }
            ].map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSettings(prev => ({
                  ...prev,
                  appearance: { ...prev.appearance, theme: theme.id }
                }))}
                className={`flex-1 p-4 rounded-xl border transition-all ${
                  settings.appearance.theme === theme.id
                    ? 'border-sky-500 bg-sky-500/10'
                    : 'border-white/10 hover:border-white/20 bg-white/5'
                }`}
              >
                <theme.icon className={`w-6 h-6 mx-auto mb-2 ${
                  settings.appearance.theme === theme.id ? 'text-sky-400' : 'text-gray-400'
                }`} />
                <p className={`text-sm font-medium ${
                  settings.appearance.theme === theme.id ? 'text-white' : 'text-gray-400'
                }`}>
                  {theme.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <SettingRow
            icon={Zap}
            title="Animations"
            description="Enable smooth animations and transitions"
          >
            <Toggle 
              enabled={settings.appearance.animations}
              onChange={() => handleToggle('appearance', 'animations')}
            />
          </SettingRow>
          <SettingRow
            icon={Monitor}
            title="Compact Mode"
            description="Reduce spacing for more content"
          >
            <Toggle 
              enabled={settings.appearance.compactMode}
              onChange={() => handleToggle('appearance', 'compactMode')}
            />
          </SettingRow>
        </div>
      </motion.section>

      {/* Help & Support */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-pink-500/20">
            <HelpCircle className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Help & Support</h2>
            <p className="text-sm text-gray-400">Get assistance and learn more</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Documentation', desc: 'Learn how to use LensLine' },
            { label: 'FAQs', desc: 'Frequently asked questions' },
            { label: 'Contact Support', desc: 'Get help from our team' },
            { label: 'Privacy Policy', desc: 'How we handle your data' }
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
            >
              <div className="text-left">
                <h4 className="text-white font-medium">{item.label}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </motion.section>
    </motion.div>
  )
}
