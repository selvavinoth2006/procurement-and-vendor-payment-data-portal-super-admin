import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Building2, Store, Mail, Phone, MapPin, ShieldCheck, XCircle, CheckCircle2, User, CreditCard, AlertTriangle, Trash2, Activity, RotateCcw } from 'lucide-react'
import { WarningModal } from './WarningModal'
import { ActivityTrailModal } from './ActivityTrailModal'

export const DetailsViewModal = ({ isOpen, onClose, data, type = 'organization', onApprove, onReject, onWarn, onRemove }) => {
  const [warningModalOpen, setWarningModalOpen] = useState(false)
  const [activityTrailOpen, setActivityTrailOpen] = useState(false)

  if (!isOpen || !data) return null
  const isOrg = type === 'organization'

  return createPortal(
    <>
      
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden my-auto relative z-[10000] animate-fade-in">

        {/* Modal Header */}
        <div className="px-7 py-4 sm:py-5 border-b border-slate-100 flex items-start justify-between bg-white shrink-0">
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isOrg ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-teal-50 border border-teal-200 text-teal-700'
            }`}>
              {isOrg ? <Building2 className="w-6 h-6" /> : <Store className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-xl font-bold text-slate-900 leading-tight">{data.name}</h3>
                <span className={
                  (data.status === 'Active' || data.status === 'Approved') ? 'badge-approved' :
                  (data.status === 'Deactivated' || data.status === 'Removed' || data.status === 'Rejected') ? 'badge-rejected' : 'badge-pending'
                }>
                  {(data.status === 'Approved' || data.status === 'Active') ? 'Active' : (data.status === 'Rejected' || data.status === 'Deactivated' || data.status === 'Removed') ? 'Deactivated' : data.status}
                </span>

                <button
                  type="button"
                  onClick={() => setActivityTrailOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Activity className="w-3.5 h-3.5" /> Activity Trail
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Entity ID: <span className="font-mono font-bold text-slate-700">{data.id}</span> &bull; Registered {new Date(data.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-6 sm:p-7 overflow-y-auto flex-1 space-y-5">

          {/* Pending Reactivation Request Appeal Banner */}
          {data.reactivation_status === 'Pending' && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium">
              <RotateCcw className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-amber-950 text-sm mb-0.5">Reactivation Request Submitted (Appeal Pending)</span>
                <span>User submitted an appeal: <em>"{data.reactivation_reason || data.appeal_explanation || 'Reactivation requested.'}"</em></span>
              </div>
            </div>
          )}

          {data.status === 'Warned' && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-amber-900 mb-0.5">Entity Under Official Warning</span>
                <span>This account has been flagged for misbehavior. Admin can deactivate if misbehavior continues.</span>
                {(data.warning_reason || data.rejection_reason) && (
                  <div className="mt-1.5 pt-1.5 border-t border-amber-200 font-normal">
                    <strong>Reported Reason:</strong> {data.warning_reason || data.rejection_reason}
                  </div>
                )}
              </div>
            </div>
          )}

          {(data.status === 'Deactivated' || data.status === 'Removed' || data.status === 'Rejected') && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
              <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-red-900 mb-0.5">Account Deactivated</span>
                <span>This account has been removed. Logins are currently blocked.</span>
                {(data.deactivation_reason || data.rejection_reason) && (
                  <div className="mt-1.5 pt-1.5 border-t border-red-200 font-normal">
                    <strong>Reason for Deactivation:</strong> {data.deactivation_reason || data.rejection_reason}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2-Column Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Contact Information Card */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" /> Primary Contact &amp; Business Info
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Contact Person:</span>
                  <span className="font-bold text-slate-800">{data.contact_person || data.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Email Address:</span>
                  <span className="font-semibold text-slate-800">{data.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Phone Contact:</span>
                  <span className="font-semibold text-slate-800">{data.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Industry / Category:</span>
                  <span className="font-bold text-slate-800">{data.industry || data.category || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Tax & Financial Credentials Card */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-500" /> Compliance &amp; Tax Documentation
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">GSTIN Tax ID:</span>
                  <span className="font-mono font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    {data.gstin || 'N/A'}
                  </span>
                </div>
                {data.pan && (
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">PAN Card ID:</span>
                    <span className="font-mono font-bold text-slate-800">{data.pan}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Reactivation Status:</span>
                  <span className="font-bold text-slate-800">{data.reactivation_status || 'None'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-7 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {data.status !== 'Deactivated' ? (
              <>
                <button
                  type="button"
                  onClick={() => setWarningModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all shadow-sm"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Warn
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (onRemove) {
                      await onRemove(data.id, 'Deactivated via Details View')
                      onClose()
                    }
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-sm"
                >
                  <Trash2 className="w-4 h-4" /> Deactivate
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  if (onApprove) {
                    await onApprove(data.id)
                    onClose()
                  }
                }}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> Activate / Restore Access
              </button>
            )}
          </div>
        </div>

      </div>
    </div>

      <WarningModal
        isOpen={warningModalOpen}
        onClose={() => setWarningModalOpen(false)}
        onConfirm={async (reason) => {
          if (onWarn) {
            await onWarn(data.id, reason)
          }
        }}
        entityType={isOrg ? 'Organization' : 'Vendor'}
        entityName={data.name}
      />

      <ActivityTrailModal
        isOpen={activityTrailOpen}
        onClose={() => setActivityTrailOpen(false)}
        user={data}
      />
    </>,
    document.body
  )
}
