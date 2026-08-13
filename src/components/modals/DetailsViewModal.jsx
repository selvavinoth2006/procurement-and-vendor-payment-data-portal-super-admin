import React from 'react'
import { createPortal } from 'react-dom'
import { X, Building2, Store, Mail, Phone, MapPin, ShieldCheck, XCircle, CheckCircle2, User, CreditCard } from 'lucide-react'

export const DetailsViewModal = ({ isOpen, onClose, data, type = 'organization', onApprove, onReject }) => {
  if (!isOpen || !data) return null
  const isOrg = type === 'organization'

  return createPortal(
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
                  data.status === 'Approved' ? 'badge-approved' :
                  data.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'
                }>
                  {data.status}
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

          {/* 2-Column Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Contact Information Card */}
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-green-600" /> Contact Details
              </h4>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{data.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{data.phone || 'N/A'}</span>
                </div>
                {data.contact_person && (
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                    <span className="text-slate-500">Key Contact Person:</span>
                    <span className="font-bold text-slate-900">{data.contact_person}</span>
                  </div>
                )}
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

          <div className="flex items-center gap-3">
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

            {data.status === 'Approved' && onReject && (
              <button
                type="button"
                onClick={() => {
                  onReject(data)
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all shadow-sm"
              >
                <XCircle className="w-4 h-4" /> Revoke Approval
              </button>
            )}

            {data.status === 'Rejected' && onApprove && (
              <button
                type="button"
                onClick={async () => {
                  await onApprove(data.id)
                  onClose()
                }}
                className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> Re-Approve {isOrg ? 'Organization' : 'Vendor'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>,
    document.body
  )
}
