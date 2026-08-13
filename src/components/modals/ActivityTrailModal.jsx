import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Activity, Search, RefreshCw, ShieldAlert, FileText, CheckCircle2, AlertTriangle, Trash2, Clock, User, LogIn, Upload, ShieldCheck } from 'lucide-react'
import { apiService } from '../../services/api'

export const ActivityTrailModal = ({ isOpen, onClose, user }) => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isOpen && user) {
      loadLogs()
    }
  }, [isOpen, user])

  const loadLogs = async () => {
    if (!user) return
    setLoading(true)
    const fetched = await apiService.getUserActivityLogs(user.id, user.id, user.email)
    setLogs(fetched)
    setLoading(false)
  }

  if (!isOpen || !user) return null

  const filteredLogs = logs.filter(l => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (l.action && l.action.toLowerCase().includes(term)) ||
           (l.details && l.details.toLowerCase().includes(term)) ||
           (l.user_email && l.user_email.toLowerCase().includes(term))
  })

  const getActionIcon = (action = '') => {
    const act = action.toLowerCase()
    if (act.includes('warning')) return <AlertTriangle className="w-4 h-4 text-amber-600" />
    if (act.includes('deactivat') || act.includes('reject')) return <Trash2 className="w-4 h-4 text-red-600" />
    if (act.includes('reactivat') || act.includes('approv') || act.includes('accept')) return <CheckCircle2 className="w-4 h-4 text-green-600" />
    if (act.includes('login') || act.includes('auth')) return <LogIn className="w-4 h-4 text-blue-600" />
    if (act.includes('upload') || act.includes('doc') || act.includes('invoice') || act.includes('po')) return <Upload className="w-4 h-4 text-teal-600" />
    return <Activity className="w-4 h-4 text-purple-600" />
  }

  const getActionBadgeColor = (action = '') => {
    const act = action.toLowerCase()
    if (act.includes('warning')) return 'bg-amber-50 text-amber-700 border-amber-200'
    if (act.includes('deactivat') || act.includes('reject')) return 'bg-red-50 text-red-700 border-red-200'
    if (act.includes('reactivat') || act.includes('approv') || act.includes('accept')) return 'bg-green-50 text-green-700 border-green-200'
    if (act.includes('login') || act.includes('auth')) return 'bg-blue-50 text-blue-700 border-blue-200'
    return 'bg-purple-50 text-purple-700 border-purple-200'
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] my-auto flex flex-col relative z-[10000] animate-fade-in">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 leading-tight">User Recent Activity Trail</h3>
              <p className="text-xs text-slate-500">
                Audit trail timeline for <span className="font-semibold text-slate-800">{user.name || user.email}</span>
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Sub-header */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search user actions, logs & details..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 font-medium"
            />
          </div>
          <button
            onClick={loadLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-purple-700 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-200 rounded-xl transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {/* Activity Timeline List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-7 h-7 border-[3px] border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Activity className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              No recent activity logs recorded for this user.
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {filteredLogs.map((log, idx) => (
                <div key={log.id || idx} className="relative flex items-start gap-4 group">

                  {/* Dot icon */}
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                    {getActionIcon(log.action)}
                  </div>

                  {/* Log Content Card */}
                  <div className="flex-1 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-1.5 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getActionBadgeColor(log.action)}`}>
                        {log.action}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(log.created_at || Date.now()).toLocaleString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 leading-snug">
                      {log.details}
                    </p>

                    {(log.user_email || user.email) && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-1 border-t border-slate-200/50">
                        <User className="w-3 h-3" /> User: <span className="font-semibold text-slate-600">{log.user_name || user.name}</span> ({log.user_email || user.email})
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400 font-medium">
            Total Logged Events: <span className="font-bold text-slate-700">{filteredLogs.length}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
