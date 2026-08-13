import React, { useState, useEffect } from 'react'
import { Building2, Search, Filter, Eye, Plus, AlertTriangle, Trash2, Activity } from 'lucide-react'
import { apiService } from '../services/api'
import { DetailsViewModal } from '../components/modals/DetailsViewModal'
import { WarningModal } from '../components/modals/WarningModal'
import { DeactivateModal } from '../components/modals/DeactivateModal'
import { ActivityTrailModal } from '../components/modals/ActivityTrailModal'
import { AddOrganizationModal } from '../components/modals/AddOrganizationModal'

export const OrganizationsMaster = () => {
  const [organizations, setOrganizations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [industryFilter, setIndustryFilter] = useState('All')
  const [inspectOrg, setInspectOrg] = useState(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [warningModalOpen, setWarningModalOpen] = useState(false)
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false)
  const [activityModalOpen, setActivityModalOpen] = useState(false)
  const [targetOrg, setTargetOrg] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      const data = await apiService.getOrganizations()
      setOrganizations(data)
      setLoading(false)
    }
    fetch()
  }, [])

  const handleCreateOrg = async (formData) => {
    const updated = await apiService.createOrganization(formData)
    setOrganizations(updated)
  }
  const handleApprove = async (id) => {
    const updated = await apiService.updateOrgStatus(id, 'Active')
    setOrganizations(updated)
  }
  const handleWarn = async (id, reason) => {
    const updated = await apiService.updateOrgStatus(id, 'Warned', reason)
    setOrganizations(updated)
  }
  const handleRemove = async (id) => {
    const updated = await apiService.updateOrgStatus(id, 'Deactivated')
    setOrganizations(updated)
  }

  const industries = ['All', ...new Set(organizations.map(o => o.industry).filter(Boolean))]
  const filteredOrgs = organizations.filter(org => {
    const matchesStatus   = statusFilter === 'All' ||
      (statusFilter === 'Active' && (org.status === 'Active' || org.status === 'Approved')) ||
      (statusFilter === 'Deactivated' && (org.status === 'Deactivated' || org.status === 'Removed' || org.status === 'Rejected')) ||
      org.status === statusFilter
    const matchesIndustry = industryFilter === 'All' || org.industry === industryFilter
    const matchesSearch   = org.name?.toLowerCase().includes(searchTerm.toLowerCase()) || org.email?.toLowerCase().includes(searchTerm.toLowerCase()) || org.gstin?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesIndustry && matchesSearch
  })

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-header flex items-center gap-2"><Building2 className="w-6 h-6 text-green-600" /> Organizations Master Directory</h1>
          <p className="page-sub">Complete global master list of buyer enterprises across all governance statuses</p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Organization
        </button>
      </div>

      {/* Controls */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search company name, email, or GSTIN..." className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="filter-select">
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Warned">Warned</option>
          <option value="Deactivated">Deactivated</option>
        </select>
        <select value={industryFilter} onChange={e => setIndustryFilter(e.target.value)} className="filter-select">
          {industries.map(ind => <option key={ind} value={ind}>Industry: {ind}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-48"><div className="w-7 h-7 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin"></div></div>
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
              {filteredOrgs.map(org => (
                <tr key={org.id} className="group">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{org.name}</div>
                        <div className="text-xs text-gray-400">{org.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-medium text-gray-700">{org.industry}</td>
                  <td className="font-mono text-green-700 font-semibold text-xs">{org.gstin || 'N/A'}</td>
                  <td className="font-bold text-green-700">₹{(org.spend || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td><span className={(org.status === 'Active' || org.status === 'Approved') ? 'badge-approved' : (org.status === 'Deactivated' || org.status === 'Removed' || org.status === 'Rejected') ? 'badge-rejected' : 'badge-pending'}>{(org.status === 'Approved' || org.status === 'Active') ? 'Active' : (org.status === 'Rejected' || org.status === 'Deactivated' || org.status === 'Removed') ? 'Deactivated' : org.status}</span></td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      <button
                        onClick={() => { setSelectedUser(org); setActivityModalOpen(true) }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-xl text-xs font-semibold transition-colors"
                        title="View user recent activity trail"
                      >
                        <Activity className="w-3.5 h-3.5" /> Trail
                      </button>
                      <button
                        onClick={() => { setInspectOrg(org); setDetailsModalOpen(true) }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-200 rounded-xl text-xs font-medium text-gray-600 hover:text-green-700 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </button>
                      {org.status !== 'Deactivated' && (
                        <button
                          onClick={() => { setTargetOrg(org); setWarningModalOpen(true) }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-xl text-xs font-semibold transition-colors"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" /> Warn
                        </button>
                      )}
                      {org.status !== 'Deactivated' ? (
                        <button
                          onClick={() => { setTargetOrg(org); setDeactivateModalOpen(true) }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl text-xs font-semibold transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApprove(org.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 rounded-xl text-xs font-semibold transition-colors"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrgs.length === 0 && (
            <div className="p-12 text-center text-gray-400 text-sm">No organizations match your filters.</div>
          )}
        </div>
      )}

      <DetailsViewModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        data={inspectOrg}
        type="organization"
        onApprove={handleApprove}
        onWarn={(id, reason) => apiService.warnUser(id, 'Organization', reason)}
        onRemove={(id, reason) => apiService.deactivateUser(id, 'Organization', reason)}
      />

      <WarningModal
        isOpen={warningModalOpen}
        onClose={() => setWarningModalOpen(false)}
        onConfirm={async (reason) => {
          if (targetOrg) {
            const updated = await apiService.warnUser(targetOrg.id, 'Organization', reason)
            setOrganizations(updated)
          }
        }}
        entityType="Organization"
        entityName={targetOrg?.name}
      />

      <DeactivateModal
        isOpen={deactivateModalOpen}
        onClose={() => setDeactivateModalOpen(false)}
        onConfirm={async (reason) => {
          if (targetOrg) {
            const updated = await apiService.deactivateUser(targetOrg.id, 'Organization', reason)
            setOrganizations(updated)
          }
        }}
        entityType="Organization"
        entityName={targetOrg?.name}
      />

      <ActivityTrailModal
        isOpen={activityModalOpen}
        onClose={() => setActivityModalOpen(false)}
        user={selectedUser}
      />

      <AddOrganizationModal key={addModalOpen ? 'add-org-open' : 'add-org-closed'} isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} onCreated={handleCreateOrg} />
    </div>
  )
}

