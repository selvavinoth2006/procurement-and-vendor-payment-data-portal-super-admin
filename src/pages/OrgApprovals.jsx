import React, { useState, useEffect } from 'react'
import {
  Building2, CheckCircle2, XCircle, Search, Eye,
  RefreshCw, ChevronDown, Filter
} from 'lucide-react'
import { apiService } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { RejectionReasonModal } from '../components/modals/RejectionReasonModal'
import { DetailsViewModal } from '../components/modals/DetailsViewModal'

export const OrgApprovals = () => {
  const navigate = useNavigate()
  const [organizations, setOrganizations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [industryFilter, setIndustryFilter] = useState('All')
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [targetOrg, setTargetOrg] = useState(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [inspectOrg, setInspectOrg] = useState(null)

  const loadOrganizations = async () => {
    setLoading(true)
    const data = await apiService.getOrganizations()
    setOrganizations(data)
    setLoading(false)
  }
  useEffect(() => { loadOrganizations() }, [])

  const handleApprove = async (id) => {
    const updated = await apiService.updateOrgStatus(id, 'Approved')
    setOrganizations(updated)
  }
  const handleConfirmRejection = async (reason) => {
    if (!targetOrg) return
    const updated = await apiService.updateOrgStatus(targetOrg.id, 'Rejected', reason)
    setOrganizations(updated)
  }

  const tabs = ['All', 'Pending', 'Approved', 'Rejected']
  const industries = ['All', ...new Set(organizations.map(o => o.industry).filter(Boolean))]

  const filtered = organizations.filter(org => {
    const matchTab  = activeTab === 'All' || org.status === activeTab
    const matchInd  = industryFilter === 'All' || org.industry === industryFilter
    const matchSrch = !searchTerm ||
      org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.gstin?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchTab && matchInd && matchSrch
  })

  const counts = {
    All:      organizations.length,
    Pending:  organizations.filter(o => o.status === 'Pending').length,
    Approved: organizations.filter(o => o.status === 'Approved').length,
    Rejected: organizations.filter(o => o.status === 'Rejected').length,
  }

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header flex items-center gap-2">
            <Building2 className="w-6 h-6 text-green-600" /> Organization Governance
          </h1>
          <p className="page-sub">
            Review buyer organization compliance, GSTIN documentation &amp; activate accounts
          </p>
        </div>
        <button
          onClick={loadOrganizations}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-green-300 rounded-xl text-sm font-medium text-gray-600 hover:text-green-700 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Tabs + Filters */}
      <div className="card p-3 flex flex-wrap items-center justify-between gap-3">
        {/* Status tabs */}
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

        {/* Search + Industry filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search company name, email or GSTIN..."
              className="w-72 bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
            />
          </div>
          <select
            value={industryFilter}
            onChange={e => setIndustryFilter(e.target.value)}
            className="filter-select"
          >
            {industries.map(ind => <option key={ind} value={ind}>Industry: {ind}</option>)}
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
                <th>Company Name</th>
                <th>Industry</th>
                <th>GSTIN Tax ID</th>
                <th>Cumulative Spend</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <Building2 className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 font-medium">No organizations found</p>
                    <p className="text-gray-300 text-xs mt-1">No registrations match the current filters</p>
                  </td>
                </tr>
              ) : filtered.map(org => (
                <tr
                  key={org.id}
                  onClick={() => navigate(`/organizations/${org.id}`)}
                  className="cursor-pointer hover:bg-green-50/60 transition-colors"
                >

                  {/* Company Name */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm leading-tight">{org.name}</div>
                        <div className="text-xs text-gray-400">{org.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Industry */}
                  <td className="font-medium text-gray-700">{org.industry}</td>

                  {/* GSTIN */}
                  <td>
                    <span className="font-mono text-xs font-semibold text-green-800 bg-green-50 border border-green-100 px-2 py-0.5 rounded-lg">
                      {org.gstin || '—'}
                    </span>
                  </td>

                  {/* Spend */}
                  <td className="font-bold text-gray-900">
                    ₹{(org.spend || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Status */}
                  <td>
                    <span className={
                      org.status === 'Approved' ? 'badge-approved' :
                      org.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'
                    }>
                      {org.status}
                    </span>
                    {org.status === 'Rejected' && org.rejection_reason && (
                      <p className="text-[10px] text-red-500 mt-0.5 max-w-[120px] truncate" title={org.rejection_reason}>
                        {org.rejection_reason}
                      </p>
                    )}
                  </td>

                  {/* Actions */}
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {/* View Details */}
                      <button
                        onClick={() => { setInspectOrg(org); setDetailsModalOpen(true) }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 rounded-xl text-xs font-medium text-gray-600 hover:text-green-700 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </button>

                      {/* Approve / Reject based on status */}
                      {org.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => { setTargetOrg(org); setRejectModalOpen(true) }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl text-xs font-semibold transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                          <button
                            onClick={() => handleApprove(org.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                        </>
                      )}
                      {org.status === 'Approved' && (
                        <button
                          onClick={() => { setTargetOrg(org); setRejectModalOpen(true) }}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 rounded-xl text-xs font-semibold transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                      {org.status === 'Rejected' && (
                        <button
                          onClick={() => handleApprove(org.id)}
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

          {/* Footer row count */}
          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <span className="text-xs text-gray-400">
                Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of{' '}
                <span className="font-semibold text-gray-700">{organizations.length}</span> organizations
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
        entityType="Organization"
        entityName={targetOrg?.name}
      />
      <DetailsViewModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        data={inspectOrg}
        type="organization"
      />
    </div>
  )
}
