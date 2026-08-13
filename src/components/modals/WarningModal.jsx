import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, AlertTriangle, ShieldAlert } from 'lucide-react'

const PRESET_WARNINGS = [
  'Late Delivery / Repeated Shipment Delays',
  'Quality Control Defect / Inferior Material Standard',
  'Invoicing Mismatch / Incorrect Pricing Billing',
  'Non-responsive / Repeated Failure to Communicate',
  'Unprofessional Conduct / Contract Terms Violation',
  'Custom Reason (Specify Below)'
]

export const WarningModal = ({ isOpen, onClose, onConfirm, entityType = 'Vendor', entityName = '' }) => {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_WARNINGS[0])
  const [customReason, setCustomReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setSelectedPreset(PRESET_WARNINGS[0])
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
        setError('Please enter a custom warning description.')
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
      setError(err.message || 'Failed to submit warning.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] my-auto flex flex-col relative z-[10000] animate-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-amber-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 leading-tight">Warn / Report {entityType}</h3>
              <p className="text-xs text-slate-500">Document official misbehavior warning</p>
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
              <span className="text-slate-500 font-medium">Target Entity:</span>
              <span className="font-bold text-amber-800">{entityName}</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" /> {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">Select Misbehavior Category</label>
            <select
              value={selectedPreset}
              onChange={e => setSelectedPreset(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 font-medium"
            >
              {PRESET_WARNINGS.map((r, i) => <option key={i} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
              Warning Details & Description <span className="text-slate-400 normal-case font-normal">(saved to activity log)</span>
            </label>
            <textarea
              rows={3}
              value={customReason}
              onChange={e => { setCustomReason(e.target.value); setError('') }}
              placeholder="Provide detailed description of the misbehavior..."
              className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-800 resize-none focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 font-medium"
            />
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2.5 text-xs text-amber-800">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              <strong>Policy:</strong> First-time misbehavior triggers an official warning. If the entity misbehaves again, they can be removed/deactivated from the platform.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-sm disabled:opacity-60">
              {isSubmitting ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Issuing...</> : 'Issue Official Warning'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}