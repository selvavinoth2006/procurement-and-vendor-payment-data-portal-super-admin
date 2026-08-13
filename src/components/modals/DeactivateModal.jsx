import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Trash2, ShieldAlert, AlertTriangle } from 'lucide-react'

const PRESET_DEACTIVATIONS = [
  'Continued policy violations after official warning',
  'Fraudulent document / GSTIN tax ID submission',
  'Unresolved vendor performance disputes',
  'Security compromise or suspicious account activity',
  'Non-payment / Repeated billing default',
  'Custom Reason (Specify Below)'
]

export const DeactivateModal = ({ isOpen, onClose, onConfirm, entityType = 'Vendor', entityName = '' }) => {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_DEACTIVATIONS[0])
  const [customReason, setCustomReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setSelectedPreset(PRESET_DEACTIVATIONS[0])
      setCustomReason('')
      setError('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    let finalReason = selectedPreset
    if (selectedPreset === 'Custom Reason (Specify Below)') {
      if (!customReason.trim()) {
        setError('Please enter a custom deactivation reason.')
        return
      }
      finalReason = customReason.trim()
    } else if (customReason.trim()) {
      finalReason = `${selectedPreset} - ${customReason.trim()}`
    }

    setIsSubmitting(true)
    try {
      await onConfirm(finalReason)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to deactivate user.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] my-auto flex flex-col relative z-[10000] animate-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-red-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 leading-tight">Deactivate Account</h3>
              <p className="text-xs text-slate-500">Block platform access & revoke permissions for {entityType}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {entityName && (
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">Target Account:</span>
              <span className="font-bold text-red-800">{entityName}</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" /> {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Deactivation Reason Category</label>
            <select
              value={selectedPreset}
              onChange={e => setSelectedPreset(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 font-medium"
            >
              {PRESET_DEACTIVATIONS.map((r, i) => <option key={i} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
              Specific Deactivation Notes & Justification
            </label>
            <textarea
              rows={3}
              value={customReason}
              onChange={e => { setCustomReason(e.target.value); setError('') }}
              placeholder="Enter detailed reason (e.g., Continued policy violations after warning)..."
              className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-800 resize-none focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 font-medium"
            />
          </div>

          <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex gap-2.5 text-xs text-red-800">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <p>
              <strong>Impact:</strong> Deactivating this account will block portal logins immediately. The user will only be able to submit a reactivation appeal request.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm disabled:opacity-60">
              {isSubmitting ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Deactivating...</> : 'Confirm Account Deactivation'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
