import React, { useState, useEffect } from 'react'
import { RotateCcw, CheckCircle2, XCircle, AlertTriangle, RefreshCw, User, Mail, ShieldAlert, FileText, Check, X } from 'lucide-react'
import { apiService } from '../services/api'

export const ReactivationRequestsPanel = ({ onRequestReviewed }) => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)

  const loadRequests = async () => {
    setLoading(true)
    const data = await apiService.getReactivationRequests()
    setRequests(data)
    setLoading(false)
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const handleReview = async (id, entityType, action) => {
    setProcessingId(id)
    try {
      await apiService.reviewReactivationRequest(id, entityType, action)
      await loadRequests()
      if (onRequestReviewed) onRequestReviewed()
    } catch (e) {
      console.error('Reactivation review error:', e)
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className="card p-6 flex items-center justify-center min-h-[160px]">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          Loading Reactivation Requests...
        </div>
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="card p-6 text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h4 className="font-bold text-slate-800 text-sm">No Pending Reactivation Appeals</h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          All deactivated user accounts are up to date. There are currently no pending reactivation appeal requests submitted for review.
        </p>
      </div>
    )
  }

  return (
    <div className="card p-5 space-y-4 border border-amber-200/80 bg-gradient-to-b from-amber-50/30 to-white">

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 font-bold shrink-0">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              Pending Reactivation Requests Review
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold">
                {requests.length} Pending
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Review and accept or decline reactivation appeals from deactivated users
            </p>
          </div>
        </div>

        <button
          onClick={loadRequests}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-amber-300 rounded-xl text-xs font-medium text-slate-600 hover:text-amber-700 transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh List
        </button>
      </div>

      {/* Requests Grid */}
      <div className="space-y-3">
        {requests.map(req => {
          const isProcessing = processingId === req.id

          return (
            <div
              key={req.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 hover:border-amber-300 transition-all shadow-xs"
            >
              {/* User Meta Row */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-sm">{req.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide">
                        {req.role || req.entityType}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-400" /> {req.email}
                    </div>
                  </div>
                </div>

                <div className="text-right text-[10px] text-slate-400 font-medium">
                  Requested: {new Date(req.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>

              {/* Reasons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Deactivation Reason */}
                <div className="p-3 rounded-xl bg-red-50/70 border border-red-200/80 space-y-1">
                  <div className="font-bold text-red-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" /> Reason for Deactivation:
                  </div>
                  <p className="text-red-800 font-medium">{req.deactivation_reason}</p>
                </div>

                {/* Appeal Explanation */}
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0" /> User Appeal Explanation:
                  </div>
                  <p className="text-amber-900 font-medium italic">"{req.appeal_explanation}"</p>
                </div>
              </div>

              {/* Action Buttons: Accept / Decline */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-400 font-semibold">
                  Select Action to Review Appeal:
                </span>

                <div className="flex items-center gap-2">
                  {/* Decline Button */}
                  <button
                    onClick={() => handleReview(req.id, req.entityType, 'Decline')}
                    disabled={isProcessing}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    Decline Appeal
                  </button>

                  {/* Accept Button */}
                  <button
                    onClick={() => handleReview(req.id, req.entityType, 'Accept')}
                    disabled={isProcessing}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Accept & Restore Access
                  </button>
                </div>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}
