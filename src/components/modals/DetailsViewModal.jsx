import React from 'react'
import { X, Building2, Store, Mail, Phone, MapPin, FileText, ShieldCheck, XCircle } from 'lucide-react'

export const DetailsViewModal = ({ isOpen, onClose, data, type = 'organization' }) => {
  if (!isOpen || !data) return null
  const isOrg = type === 'organization'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-card-lg border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 border border-green-200 flex items-center justify-center text-green-700">
              {isOrg ? <Building2 className="w-5 h-5" /> : <Store className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xl text-gray-900">{data.name}</h3>
                <span className={data.status === 'Approved' ? 'badge-approved' : data.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}>{data.status}</span>
              </div>
              <p className="text-xs text-gray-400">ID: {data.id} &bull; Registered {new Date(data.created_at || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm">

          {/* Rejection notice */}
          {data.status === 'Rejected' && data.rejection_reason && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 space-y-1">
              <div className="flex items-center gap-2 font-semibold"><XCircle className="w-4 h-4" /> Rejection Reason Documented</div>
              <p className="text-xs text-red-600 pl-6">{data.rejection_reason}</p>
            </div>
          )}

          {/* Contact + Tax Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2.5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Contact</p>
              <div className="flex items-center gap-2 text-gray-700"><Mail className="w-4 h-4 text-green-500" />{data.email}</div>
              <div className="flex items-center gap-2 text-gray-700"><Phone className="w-4 h-4 text-green-500" />{data.phone}</div>
              {!isOrg && data.contact_person && (
                <div className="pt-2 border-t border-gray-200 text-xs flex justify-between">
                  <span className="text-gray-400">Key Contact:</span>
                  <span className="font-semibold text-gray-900">{data.contact_person}</span>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2.5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Tax & Business Compliance</p>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">GSTIN:</span>
                <span className="font-mono bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-lg text-xs text-green-700 font-bold">{data.gstin || 'N/A'}</span>
              </div>
              {!isOrg && data.pan && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">PAN:</span>
                  <span className="font-mono bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-lg text-xs text-green-700 font-bold">{data.pan}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">{isOrg ? 'Industry:' : 'Category:'}</span>
                <span className="text-gray-800 font-semibold text-xs">{isOrg ? data.industry : data.category}</span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <p className="text-gray-700 leading-relaxed text-sm">{data.address || 'Address not available'}</p>
          </div>

          {/* Vendor Performance */}
          {!isOrg && (
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block uppercase font-semibold">Performance Rating</span>
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-36 bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${data.rating >= 90 ? 'bg-green-500' : data.rating >= 70 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${data.rating || 0}%` }} />
                  </div>
                  <span className="font-bold text-gray-900">{data.rating || 0}%</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block uppercase font-semibold">Catalog Items</span>
                <span className="font-extrabold text-green-700 text-xl">{data.products_count || 0}</span>
              </div>
            </div>
          )}

          {/* Org Spend */}
          {isOrg && data.spend !== undefined && (
            <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 block uppercase font-semibold">Cumulative Procurement Spend</span>
                <span className="font-extrabold text-green-700 text-xl">₹{data.spend.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <ShieldCheck className="w-7 h-7 text-green-500" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
