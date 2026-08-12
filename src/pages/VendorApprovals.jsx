import React, { useState, useEffect } from 'react'
import {
  Store, CheckCircle2, XCircle, Search, Eye,
  RefreshCw, User, FileText
} from 'lucide-react'
import { apiService } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { RejectionReasonModal } from '../components/modals/RejectionReasonModal'
import { DetailsViewModal } from '../components/modals/DetailsViewModal'

export const VendorApprovals = () => {
  const navigate = useNavigate()
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [targetVendor, setTargetVendor] = useState(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [inspectVendor, setInspectVendor] = useState(null)

  const loadVendors = async () => {
    setLoading(true)
    const data = await apiService.getVendors()
    setVendors(data)
    setLoading(false)
  }
  useEffect(() => { loadVendors() }, [])

  const handleApprove = async (id) => {
    const updated = await apiService.updateVendorStatus(id, 'Approved')
    setVendors(updated)
  }
  const handleConfirmRejection = async (reason) => {
    if (!targetVendor) return
    const updated = await apiService.updateVendorStatus(targetVendor.id, 'Rejected', reason)
    setVendors(updated)
  }

  const tabs = ['All', 'Pending', 'Approved', 'Rejected']
  const categories = ['All', ...new Set(vendors.map(v => v.category).filter(Boolean))]

  const filtered = vendors.filter(v => {
    const matchTab  = activeTab === 'All' || v.status === activeTab
    const matchCat  = categoryFilter === 'All' || v.category === categoryFilter
    const matchSrch = !searchTerm ||
      v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.gstin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchTab && matchCat && matchSrch
  })

  const counts = {
    All:      vendors.length,
    Pending:  vendors.filter(v => v.status === 'Pending').length,
    Approved: vendors.filter(v => v.status === 'Approved').length,
    Rejected: vendors.filter(v => v.status === 'Rejected').length,
  }

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header flex items-center gap-2">
            <Store className="w-6 h-6 text-green-600" /> Vendor Governance
          </h1>
          <p className="page-sub">
            Verify supplier credentials, GSTIN/PAN, category compliance &amp; authorize platform listing
          </p>
        </div>
        <button
          onClick={loadVendors}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-green-300 rounded-xl text-sm font-medium text-gray-600 hover:text-green-700 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Tabs + Filters */}
      <div className="card p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5
                ${activeTab === tab ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              {tab}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold
                ${activeTab === tab ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search vendor name, category, GSTIN..."
              className="w-72 bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            {categories.map(cat => <option key={cat} value={cat}>Category: {cat}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="w-7 h-7 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th>Vendor / Supplier</th>
                <th>Category</th>
                <th>GSTIN / PAN</th>
                <th>Contact Person</th>
                <th>Performance</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <Store className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 font-medium">No vendors found</p>
                    <p className="text-gray-300 text-xs mt-1">No supplier registrations match the current filters</p>
                  </td>
                </tr>
              ) : filtered.map(vendor => (
                <tr
                  key={vendor.id}
                  onClick={() => navigate(`/vendors/${vendor.id}`)}
                  className="cursor-pointer hover:bg-green-50/60 transition-colors"
                >

                  {/* Vendor Name */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm leading-tight">{vendor.name}</div>
                        <div className="text-xs text-gray-400">{vendor.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {vendor.category}
                    </span>
                  </td>

                  {/* GSTIN / PAN */}
                  <td>
                    <div className="space-y-0.5">
                      <div className="font-mono text-xs font-semibold text-green-800 bg-green-50 border border-green-100 px-2 py-0.5 rounded-lg">
                        GST: {vendor.gstin || '—'}
                      </div>
                      {vendor.pan && (
                        <div className="font-mono text-xs text-gray-500">PAN: {vendor.pan}</div>
                      )}
                    </div>
                  </td>

                  {/* Contact Person */}
                  <td>
                    <div className="flex items-center gap-1.5 font-medium text-gray-700 text-sm">
                      <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      {vendor.contact_person || '—'}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 pl-5">{vendor.phone}</div>
                  </td>

                  {/* Performance */}
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            (vendor.rating || 0) >= 90 ? 'bg-green-500' :
                            (vendor.rating || 0) >= 70 ? 'bg-amber-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${vendor.rating || 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-700">{vendor.rating || 0}%</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span className={
                      vendor.status === 'Approved' ? 'badge-approved' :
                      vendor.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'
                    }>
                      {vendor.status}
                    </span>
                    {vendor.status === 'Rejected' && vendor.rejection_reason && (
                      <p className="text-[10px] text-red-500 mt-0.5 max-w-[120px] truncate" title={vendor.rejection_reason}>
                        {vendor.rejection_reason}
                      </p>
                    )}
                  </td>

                  {/* Actions */}
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setInspectVendor(vendor); setDetailsModalOpen(true) }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 rounded-xl text-xs font-medium text-gray-600 hover:text-green-700 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </button>

                      {vendor.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => { setTargetVendor(vendor); setRejectModalOpen(true) }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl text-xs font-semibold transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                          <button
                            onClick={() => handleApprove(vendor.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                        </>
                      )}
                      {vendor.status === 'Approved' && (
                        <button
                          onClick={() => { setTargetVendor(vendor); setRejectModalOpen(true) }}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 rounded-xl text-xs font-semibold transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                      {vendor.status === 'Rejected' && (
                        <button
                          onClick={() => handleApprove(vendor.id)}
                          className="px-3 py-1.5 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 rounded-xl text-xs font-semibold transition-colors"
                        >
                          Re-Approve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <span className="text-xs text-gray-400">
                Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of{' '}
                <span className="font-semibold text-gray-700">{vendors.length}</span> vendors
              </span>
              <span className="text-xs text-gray-400">
                {counts.Pending} pending · {counts.Approved} approved · {counts.Rejected} rejected
              </span>
            </div>
          )}
        </div>
      )}

      <RejectionReasonModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleConfirmRejection}
        entityType="Vendor"
        entityName={targetVendor?.name}
      />
      <DetailsViewModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        data={inspectVendor}
        type="vendor"
      />
    </div>
  )
}
