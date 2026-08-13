import React from 'react'
import { createPortal } from 'react-dom'
import { X, Building2, Store, Mail, Phone, MapPin, ShieldCheck, XCircle, CheckCircle2, User, CreditCard, AlertTriangle, Trash2 } from 'lucide-react'
import { WarningModal } from './WarningModal'
import { useState } from 'react'

export const DetailsViewModal = ({ isOpen, onClose, data, type = 'organization', onApprove, onReject, onWarn, onRemove }) => {
  const [warningModalOpen, setWarningModalOpen] = useState(false)
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
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-bold text-slate-900 leading-tight">{data.name}</h3>
                <span className={
                  (data.status === 'Active' || data.status === 'Approved') ? 'badge-approved' :
                  (data.status === 'Deactivated' || data.status === 'Removed' || data.status === 'Rejected') ? 'badge-rejected' : 'badge-pending'
                }>
                  {(data.status === 'Approved' || data.status === 'Active') ? 'Active' : (data.status === 'Rejected' || data.status === 'Deactivated' || data.status === 'Removed') ? 'Deactivated' : data.status}
                </span>
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

          {/* Rejection Notice Banner if Rejected */}
          {data.status === 'Rejected' && data.rejection_reason && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
              <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-red-900 mb-0.5">Rejection Reason Documented</span>
                <span>{data.rejection_reason}</span>
              </div>
            </div>
          )}

          {data.status === 'Warned' && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-amber-900 mb-0.5">Entity Under Official Warning</span>
                <span>This account has been flagged for misbehavior. Admin can deactivate if misbehavior continues.</span>
                {data.rejection_reason && (
                  <div className="mt-1.5 pt-1.5 border-t border-amber-200 font-normal">
                    <strong>Reported Reason:</strong> {data.rejection_reason}
                  </div>
                )}
              </div>
            </div>
          )}

          {data.status === 'Deactivated' && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
              <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-red-900 mb-0.5">Account Deactivated</span>
                <span>This account has been removed due to repeated misbehavior. Logins are currently blocked.</span>
                {data.rejection_reason && (
                  <div className="mt-1.5 pt-1.5 border-t border-red-200 font-normal">
                    <strong>Reason for Deactivation:</strong> {data.rejection_reason}
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
                <User className="w-4 h-4 text-green-600" /> CONTACT
              </h4>
              
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{data.contact_person || data.contactPerson || data.contact_name || data.contactName || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{data.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{data.phone || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Tax & Business Compliance Card */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-green-600" /> Compliance & Sector
              </h4>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">GSTIN Identification:</span>
                  <span className="font-mono bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-lg text-green-800 font-bold">
                    {data.gstin || 'N/A'}
                  </span>
                </div>
                {!isOrg && data.pan && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">PAN Number:</span>
                    <span className="font-mono bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-lg text-teal-800 font-bold">
                      {data.pan}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                  <span className="text-slate-500">{isOrg ? 'Industry Sector:' : 'Supply Category:'}</span>
                  <span className="font-bold text-slate-900">{isOrg ? data.industry : data.category}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Operating Physical Address */}
          <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                Operating Registered Address
              </h4>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                {data.address || 'No physical address provided.'}
              </p>
            </div>
          </div>

          {/* Org Spend Metric Banner */}
          {isOrg && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50/60 border border-green-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-green-800 font-bold uppercase tracking-wider block">
                  Cumulative Procurement Spend
                </span>
                <span className="text-2xl font-extrabold text-green-900 mt-0.5 block">
                  ₹{(data.spend || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-green-600 text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-7 h-7" />
              </div>
            </div>
          )}

          {/* Vendor Rating Banner */}
          {!isOrg && (
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                  Performance Rating
                </span>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="w-40 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        (data.rating || 0) >= 90 ? 'bg-green-500' : (data.rating || 0) >= 70 ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${data.rating || 0}%` }}
                    />
                  </div>
                  <span className="font-bold text-slate-900 text-xs">{data.rating || 0}%</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                  Catalog Products
                </span>
                <span className="text-xl font-extrabold text-teal-700">
                  {data.products_count || 0} items
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Actions Footer */}
        <div className="px-7 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-3 flex-wrap">
            {data.status === 'Pending' && (
              <>
                {onReject && (
                  <button
                    type="button"
                    onClick={() => {
                      onReject(data)
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all shadow-sm"
                  >
                    <XCircle className="w-4 h-4" /> Reject Request
                  </button>
                )}
                {onApprove && (
                  <button
                    type="button"
                    onClick={async () => {
                      await onApprove(data.id)
                      onClose()
                    }}
                    className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve {isOrg ? 'Organization' : 'Vendor'}
                  </button>
                )}
              </>
            )}

            {data.status === 'Approved' && (
              <>
                {onWarn && (
                  <button
                    type="button"
                    onClick={() => setWarningModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all shadow-sm"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Warn / Report Misbehavior
                  </button>
                )}
                {onRemove && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled
                      className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-gray-400 bg-gray-50 border border-gray-200 rounded-xl cursor-not-allowed opacity-50"
                      title="You must warn this entity before removing them."
                    >
                      <Trash2 className="w-4 h-4" /> Remove Account
                    </button>
                    <span className="text-[10px] text-gray-400 italic">Warn first</span>
                  </div>
                )}
              </>
            )}

            {data.status === 'Warned' && (
              <>
                {onWarn && (
                  <button
                    type="button"
                    onClick={() => setWarningModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all shadow-sm"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Warn Again
                  </button>
                )}
                {onRemove && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (window.confirm(`Are you sure you want to remove this ${isOrg ? 'organization' : 'vendor'}? they will be deactivated and blocked from logging in.`)) {
                        await onRemove(data.id)
                        onClose()
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" /> Remove Account
                  </button>
                )}
              </>
            )}

            {(data.status === 'Deactivated' || data.status === 'Removed' || data.status === 'Rejected') && onApprove && (
              <button
                type="button"
                onClick={async () => {
                  await onApprove(data.id)
                  onClose()
                }}
                className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> Restore / Approve {isOrg ? 'Organization' : 'Vendor'}
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
            await onWarn(data.id, reason);
          }
        }}
        entityType={isOrg ? 'Organization' : 'Vendor'}
        entityName={data.name}
      />
    </>,
    document.body
  )
}
