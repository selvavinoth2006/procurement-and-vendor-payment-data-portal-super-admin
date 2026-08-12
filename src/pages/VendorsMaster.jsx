import React, { useState, useEffect } from 'react'
import { Store, Search, Filter, Eye, Grid, List } from 'lucide-react'
import { apiService } from '../services/api'
import { DetailsViewModal } from '../components/modals/DetailsViewModal'

export const VendorsMaster = () => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [viewMode, setViewMode] = useState('table')
  const [inspectVendor, setInspectVendor] = useState(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  useEffect(() => {
    const fetch = async () => { setLoading(true); const data = await apiService.getVendors(); setVendors(data); setLoading(false) }
    fetch()
  }, [])

  const categories = ['All', ...new Set(vendors.map(v => v.category).filter(Boolean))]
  const filteredVendors = vendors.filter(v => {
    const matchesCat    = categoryFilter === 'All' || v.category === categoryFilter
    const matchesSearch = v.name?.toLowerCase().includes(searchTerm.toLowerCase()) || v.category?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="page-header flex items-center gap-2"><Store className="w-6 h-6 text-green-600" /> Suppliers & Vendors Directory</h1>
          <p className="page-sub">All authorized suppliers, performance ratings & catalog counts</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
          <button onClick={() => setViewMode('table')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${viewMode === 'table' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-800'}`}>
            <List className="w-3.5 h-3.5" /> Table
          </button>
          <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-800'}`}>
            <Grid className="w-3.5 h-3.5" /> Cards
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search vendor, category, contact..." className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="filter-select">
          {categories.map(cat => <option key={cat} value={cat}>Category: {cat}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48"><div className="w-7 h-7 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : viewMode === 'table' ? (
        <div className="card overflow-hidden">
          <table className="w-full data-table">
            <thead><tr><th>Vendor</th><th>Category</th><th>Contact</th><th>Catalog Items</th><th>Performance</th><th>Status</th><th className="text-right">Action</th></tr></thead>
            <tbody>
              {filteredVendors.map(vendor => (
                <tr key={vendor.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0"><Store className="w-4 h-4" /></div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{vendor.name}</div>
                        <div className="text-xs text-gray-400">{vendor.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{vendor.category}</span></td>
                  <td className="font-medium text-gray-700">{vendor.contact_person || 'N/A'}</td>
                  <td className="font-bold text-green-700">{vendor.products_count || 0}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${vendor.rating >= 90 ? 'bg-green-500' : vendor.rating >= 70 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${vendor.rating || 0}%` }} />
                      </div>
                      <span className="text-xs font-bold text-gray-700">{vendor.rating || 0}%</span>
                    </div>
                  </td>
                  <td><span className={vendor.status === 'Approved' ? 'badge-approved' : vendor.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}>{vendor.status}</span></td>
                  <td className="text-right">
                    <button onClick={() => { setInspectVendor(vendor); setDetailsModalOpen(true) }} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-200 rounded-xl text-xs font-medium text-gray-600 hover:text-green-700 transition-colors">
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredVendors.length === 0 && <div className="p-12 text-center text-gray-400 text-sm">No vendors match your filters.</div>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVendors.map(vendor => (
            <div key={vendor.id} className="card-hover p-5 space-y-4 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600"><Store className="w-5 h-5" /></div>
                <span className={vendor.status === 'Approved' ? 'badge-approved' : vendor.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}>{vendor.status}</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">{vendor.name}</h3>
                <span className="text-xs text-blue-700 font-medium">{vendor.category}</span>
              </div>
              <div className="space-y-1 text-xs text-gray-500">
                <div>Contact: <span className="text-gray-800 font-medium">{vendor.contact_person}</span></div>
                <div>Email: <span className="text-gray-700">{vendor.email}</span></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Performance</span><span className="font-bold text-green-700">{vendor.rating || 0}%</span></div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className="bg-green-500 h-full rounded-full" style={{ width: `${vendor.rating || 0}%` }} /></div>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <button onClick={() => { setInspectVendor(vendor); setDetailsModalOpen(true) }} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-200 rounded-xl text-xs font-medium text-gray-600 hover:text-green-700 transition-colors">
                  <Eye className="w-3.5 h-3.5" /> Full Inspection
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DetailsViewModal isOpen={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} data={inspectVendor} type="vendor" />
    </div>
  )
}
