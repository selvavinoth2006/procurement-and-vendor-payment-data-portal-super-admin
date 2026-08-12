import React, { useState, useEffect } from 'react'
import { ShoppingBag, Search, Filter, IndianRupee, Building2, Store, Clock, Send } from 'lucide-react'
import { apiService } from '../services/api'

export const OrdersTransactions = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetch = async () => { setLoading(true); const data = await apiService.getOrders(); setOrders(data); setLoading(false) }
    fetch()
  }, [])

  const filteredOrders = orders.filter(ord => {
    const matchesStatus = statusFilter === 'All' || ord.status === statusFilter
    const matchesSearch = ord.po_number?.toLowerCase().includes(searchTerm.toLowerCase()) || ord.buyer_name?.toLowerCase().includes(searchTerm.toLowerCase()) || ord.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const totalVolume    = orders.reduce((sum, o) => sum + o.amount, 0)
  const disbursedVol   = orders.filter(o => o.status === 'Disbursed').reduce((sum, o) => sum + o.amount, 0)
  const pendingVol     = orders.filter(o => o.status === 'Pending').reduce((sum, o) => sum + o.amount, 0)

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="page-header flex items-center gap-2"><ShoppingBag className="w-6 h-6 text-green-600" /> Orders & Transactions</h1>
        <p className="page-sub">Platform-wide audit of Purchase Orders, supplier invoices & payment disbursements</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Order Volume',       value: `₹${totalVolume.toLocaleString('en-IN')}`,    sub: `${orders.length} total orders`,        icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
          { label: 'Disbursed to Suppliers',   value: `₹${disbursedVol.toLocaleString('en-IN')}`,   sub: 'Settled to vendor accounts',            icon: Send,        color: 'text-teal-600',  bg: 'bg-teal-50',  border: 'border-teal-100'  },
          { label: 'Pending Escrow',           value: `₹${pendingVol.toLocaleString('en-IN')}`,     sub: 'Awaiting fulfilment verification',      icon: Clock,       color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
        ].map((card, i) => {
          const Icon = card.icon
          return (
            <div key={i} className={`card p-5 border ${card.border} flex items-center gap-4`}>
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center ${card.color} shrink-0`}><Icon className="w-5 h-5" /></div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{card.label}</div>
                <div className={`text-xl font-extrabold ${card.color} tracking-tight`}>{card.value}</div>
                <div className="text-xs text-gray-400">{card.sub}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Controls */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search PO number, buyer, supplier..." className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="filter-select">
          <option value="All">All Statuses</option>
          <option value="Disbursed">Disbursed</option>
          <option value="Approved">Approved</option>
          <option value="Fulfilled">Fulfilled</option>
          <option value="Pending">Pending</option>
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
                <th>Purchase Order</th>
                <th>Buyer Organization</th>
                <th>Supplier Vendor</th>
                <th>Order Value</th>
                <th>Status</th>
                <th className="text-right">Date Issued</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(ord => (
                <tr key={ord.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0"><ShoppingBag className="w-4 h-4" /></div>
                      <div>
                        <div className="font-bold text-gray-900 font-mono text-sm">{ord.po_number}</div>
                        <div className="text-xs text-gray-400">{ord.items_count} line items</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 font-medium text-gray-700">
                      <Building2 className="w-3.5 h-3.5 text-green-500" />{ord.buyer_name}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 font-medium text-gray-700">
                      <Store className="w-3.5 h-3.5 text-teal-500" />{ord.vendor_name}
                    </div>
                  </td>
                  <td className="font-extrabold text-gray-900">₹{ord.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <span className={
                      ord.status === 'Disbursed' ? 'badge-approved' :
                      ord.status === 'Pending'   ? 'badge-pending' :
                      ord.status === 'Fulfilled' ? 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200' :
                      'badge-approved'
                    }>
                      {ord.status}
                    </span>
                  </td>
                  <td className="text-right font-medium text-gray-500">{ord.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && <div className="p-12 text-center text-gray-400 text-sm">No orders match your filters.</div>}
        </div>
      )}
    </div>
  )
}
