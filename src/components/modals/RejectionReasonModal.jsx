import React, { useState, useEffect } from 'react'
import { X, ShieldAlert, AlertTriangle } from 'lucide-react'

const PRESET_REASONS = [
  'Incomplete Tax Documentation / Missing GSTIN Certificate',
  'Tax ID (GSTIN / PAN) Mismatch or Verification Failed',
  'Business Physical Address Verification Unsuccessful',
  'Duplicate Registration Account Detected',
  'Compliance & Risk Assessment Policy Non-Compliance',
  'Custom Reason (Specify Below)',
]

export const RejectionReasonModal = ({ isOpen, onClose, onConfirm, entityType = 'Organization', entityName = '' }) => {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_REASONS[0])
  const [customReason, setCustomReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) { setSelectedPreset(PRESET_REASONS[0]); setCustomReason(''); setError('') }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    let finalReason = selectedPreset
    if (selectedPreset === 'Custom Reason (Specify Below)') {
      if (!customReason.trim()) { setError('Please enter a custom rejection reason.'); return }
      finalReason = customReason.trim()
    } else if (customReason.trim()) {
      finalReason = `${selectedPreset} — ${customReason.trim()}`
    }
    setIsSubmitting(true)
    try {
      await onConfirm(finalReason)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to submit.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-card-lg border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-red-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Reject {entityType} Signup</h3>
              <p className="text-xs text-gray-500">Select an official compliance rejection reason</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {entityName && (
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm">
              <span className="text-gray-500">Target Entity:</span>
              <span className="font-semibold text-red-700">{entityName}</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Select Rejection Reason</label>
            <select value={selectedPreset} onChange={e => setSelectedPreset(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20">
              {PRESET_REASONS.map((r, i) => <option key={i} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Additional Notes <span className="text-gray-400 normal-case">(saved to DB rejection_reason)</span></label>
            <textarea rows={3} value={customReason} onChange={e => { setCustomReason(e.target.value); setError('') }} placeholder="Provide additional details or instructions..." className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 resize-none focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20" />
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-60">
              {isSubmitting ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</> : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
