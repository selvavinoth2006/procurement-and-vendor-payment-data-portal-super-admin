import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Building2, Mail, Phone, MapPin, FileText,
  User, Award, ShoppingBag, IndianRupee, Truck, CreditCard,
  CheckCircle2, Clock, Package, AlertTriangle, ChevronRight,
  Calendar, Filter, RefreshCw, ExternalLink, TrendingUp
} from 'lucide-react'
import { apiService } from '../services/api'

/* ── small helper badge for delivery status ── */
const DeliveryBadge = ({ status }) => {
  const cfg = {
    'Delivered':        'bg-green-100 text-green-700 border-green-200',
    'In Transit':       'bg-blue-100 text-blue-700 border-blue-200',
    'Out for Delivery': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Processing':       'bg-amber-100 text-amber-700 border-amber-200',
    'Pending Pickup':   'bg-gray-100 text-gray-600 border-gray-200',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cfg[status] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>
      {status === 'Delivered' && <CheckCircle2 className="w-3 h-3" />}
      {status === 'In Transit' && <Truck className="w-3 h-3" />}
      {status === 'Processing' && <Clock className="w-3 h-3" />}
      {status === 'Out for Delivery' && <Package className="w-3 h-3" />}
      {status === 'Pending Pickup' && <AlertTriangle className="w-3 h-3" />}
      {status}
    </span>
  )
}

/* ── payment status badge ── */
const PayBadge = ({ status }) => {
  const cfg = {
    'Paid':    'bg-green-100 text-green-700 border-green-200',
    'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
    'Partial': 'bg-orange-100 text-orange-700 border-orange-200',
  }
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cfg[status] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>
      {status}
    </span>
  )
}

export const OrganizationDetail = () => {
  const { id }    = useParams()
  const navigate  = useNavigate()

  const [org, setOrg]         = useState(null)
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')

  // Filter state
  const [filterMonth, setFilterMonth]   = useState('All')
  const [filterYear,  setFilterYear]    = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [orgData, orderData] = await Promise.all([
        apiService.getOrgById(id),
        apiService.getOrgOrders(id),
      ])
      setOrg(orgData)
      setOrders(orderData)
      setLoading(false)
    }
    load()
  }, [id])

  // Unique months & years from orders
  const { months, years } = useMemo(() => {
    const ms = [...new Set(orders.map(o => o.month))].sort((a, b) => b.localeCompare(a))
    const ys = [...new Set(orders.map(o => o.date?.slice(0, 4)))].filter(Boolean).sort((a, b) => b - a)
    return { months: ms, years: ys }
  }, [orders])

  const MONTH_LABELS = {
    '01':'January','02':'February','03':'March','04':'April',
    '05':'May','06':'June','07':'July','08':'August',
    '09':'September','10':'October','11':'November','12':'December',
  }

  const filteredOrders = useMemo(() => orders.filter(o => {
    const matchMonth  = filterMonth === 'All' || o.month === filterMonth
    const matchYear   = filterYear  === 'All' || o.date?.startsWith(filterYear)
    const matchStatus = filterStatus === 'All' || o.status === filterStatus
    return matchMonth && matchYear && matchStatus
  }), [orders, filterMonth, filterYear, filterStatus])

  // Summary stats
  const totalSpend   = orders.reduce((s, o) => s + (o.amount || 0), 0)
  const totalPaid    = orders.reduce((s, o) => s + (o.paid_amount  || 0), 0)
  const totalPending = orders.reduce((s, o) => s + (o.pending_amount || 0), 0)
  const delivered    = orders.filter(o => o.delivery_status === 'Delivered').length

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!org) return (
    <div className="card p-16 text-center space-y-2">
      <Building2 className="w-12 h-12 text-gray-200 mx-auto" />
      <p className="text-gray-500 font-semibold">Organization not found</p>
      <button onClick={() => navigate('/approvals/organizations')} className="text-green-600 text-sm hover:underline">← Back to list</button>
    </div>
  )

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Back + Header ── */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => navigate('/approvals/organizations')}
          className="mt-1 p-2 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-500 hover:text-green-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="page-header">{org.name}</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
              {org.industry}
            </span>
            <span className={
              (org.status === 'Active' || org.status === 'Approved') ? 'badge-approved text-sm px-3 py-1' :
              (org.status === 'Deactivated' || org.status === 'Removed' || org.status === 'Rejected') ? 'badge-rejected text-sm px-3 py-1' : 'badge-pending text-sm px-3 py-1'
            }>
              {(org.status === 'Approved' || org.status === 'Active') ? 'Active' : (org.status === 'Rejected' || org.status === 'Deactivated' || org.status === 'Removed') ? 'Deactivated' : org.status}
            </span>
          </div>
          <p className="page-sub">Org ID: {org.id} · Contact Email: {org.email} · GSTIN: {org.gstin || 'N/A'}</p>
        </div>
      </div>

      {/* ── Summary Stat Cards (Matching Vendor style) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="card px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total Orders</p>
            <p className="text-base font-extrabold text-green-700">{orders.length} orders</p>
          </div>
        </div>
        <div className="card px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total Spend</p>
            <p className="text-base font-extrabold text-teal-700">₹{(totalSpend || org.spend || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="card px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Amount Paid</p>
            <p className="text-base font-extrabold text-emerald-700">₹{totalPaid.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="card px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Delivered Orders</p>
            <p className="text-base font-extrabold text-blue-700">{delivered} / {orders.length}</p>
          </div>
        </div>
      </div>

      {/* ── Main Tab Navigation ── */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { key: 'details',  label: 'Organization Profile Details' },
          { key: 'orders',   label: `Orders & Delivery (${orders.length})` },
          { key: 'payments', label: 'Payments' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.key ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB 1: DETAILS (Matching Vendor Profile Details Grid) ── */}
      {activeTab === 'details' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Contact Information Card */}
            <div className="card p-5 space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <User className="w-4 h-4 text-green-600" /> Contact Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Organization Name:</span>
                  <span className="font-semibold text-gray-800">{org.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Contact Person Name:</span>
                  <span className="font-semibold text-gray-800">{org.contact_person || org.contactPerson || org.contact_name || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Email Address:</span>
                  <span className="font-medium text-gray-700">{org.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Phone Number:</span>
                  <span className="font-medium text-gray-700">{org.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Industry Sector:</span>
                  <span className="font-semibold text-green-700">{org.industry}</span>
                </div>
              </div>
            </div>

            {/* Tax & Compliance Card */}
            <div className="card p-5 space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <FileText className="w-4 h-4 text-green-600" /> Tax &amp; Compliance Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">GSTIN Tax ID:</span>
                  <span className="font-mono font-bold bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-lg text-green-700 text-xs">
                    {org.gstin || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Registration Date:</span>
                  <span className="font-mono font-bold text-gray-700 text-xs">
                    {new Date(org.created_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Governance Status:</span>
                  <span className={(org.status === 'Active' || org.status === 'Approved') ? 'badge-approved' : (org.status === 'Deactivated' || org.status === 'Removed' || org.status === 'Rejected') ? 'badge-rejected' : 'badge-pending'}>
                    {(org.status === 'Approved' || org.status === 'Active') ? 'Active' : (org.status === 'Rejected' || org.status === 'Deactivated' || org.status === 'Removed') ? 'Deactivated' : org.status}
                  </span>
                </div>
                {org.rejection_reason && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 mt-2">
                    <span className="font-bold block">Rejection Note:</span>
                    {org.rejection_reason}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Address & Spend Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-5 space-y-2">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <MapPin className="w-4 h-4 text-green-600" /> Registered Business Address
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed pt-1">
                {org.address || 'Registered address information not provided.'}
              </p>
            </div>

            <div className="card p-5 space-y-3">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Award className="w-4 h-4 text-green-600" /> Procurement Spend Overview
              </h3>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Cumulative Spend Utilization</span>
                  <span className="font-extrabold text-green-700">₹{(totalSpend || org.spend || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(15, (orders.length * 10)))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: ORDERS & DELIVERY ── */}
      {activeTab === 'orders' && (
        <div className="space-y-4">

          {/* Filters Bar */}
          <div className="card p-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
              <Filter className="w-3.5 h-3.5" /> Filter by:
            </div>

            <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="filter-select text-xs">
              <option value="All">All Years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="filter-select text-xs">
              <option value="All">All Months</option>
              {months.map(m => {
                const [yr, mn] = m.split('-')
                return <option key={m} value={m}>{MONTH_LABELS[mn]} {yr}</option>
              })}
            </select>

            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="filter-select text-xs">
              <option value="All">All Statuses</option>
              <option value="Disbursed">Disbursed</option>
              <option value="Fulfilled">Fulfilled</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
            </select>

            {(filterYear !== 'All' || filterMonth !== 'All' || filterStatus !== 'All') && (
              <button
                onClick={() => { setFilterYear('All'); setFilterMonth('All'); setFilterStatus('All') }}
                className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            )}

            <span className="ml-auto text-xs text-gray-400 font-medium">
              {filteredOrders.length} of {orders.length} orders
            </span>
          </div>

          {/* Orders Table */}
          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-green-600" /> Purchase Orders &amp; Delivery Status
              </h3>
              <span className="text-xs text-gray-400">{filteredOrders.length} orders</span>
            </div>

            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Vendor / Supplier</th>
                  <th>Order Value</th>
                  <th>Order Status</th>
                  <th>Delivery Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400 font-medium">
                      No purchase orders match current filters
                    </td>
                  </tr>
                ) : filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td>
                      <div className="font-bold text-gray-900 font-mono text-sm">{order.po_number}</div>
                      <div className="text-xs text-gray-400">{order.items_count} line items</div>
                    </td>
                    <td className="font-medium text-gray-700">{order.vendor_name}</td>
                    <td className="font-extrabold text-gray-900">₹{order.amount.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={
                        order.status === 'Disbursed' || order.status === 'Fulfilled' ? 'badge-approved' :
                        order.status === 'Pending' ? 'badge-pending' : 'badge-approved'
                      }>
                        {order.status}
                      </span>
                    </td>
                    <td><DeliveryBadge status={order.delivery_status} /></td>
                    <td className="text-gray-500 font-medium">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 3: PAYMENTS ── */}
      {activeTab === 'payments' && (
        <div className="space-y-4">

          {/* Payment Summary Bar */}
          <div className="card p-5 space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-green-600" /> Payment Summary
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-green-500 rounded-l-full"
                  style={{ width: totalSpend > 0 ? `${(totalPaid / totalSpend) * 100}%` : '0%' }}
                />
                <div
                  className="h-full bg-orange-300"
                  style={{ width: totalSpend > 0 ? `${(totalPending / totalSpend) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-600 shrink-0">
                {totalSpend > 0 ? Math.round((totalPaid / totalSpend) * 100) : 0}% paid
              </span>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" /> Paid: <span className="font-bold text-green-700">₹{totalPaid.toLocaleString('en-IN')}</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-300 shrink-0" /> Pending: <span className="font-bold text-amber-700">₹{totalPending.toLocaleString('en-IN')}</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-300 shrink-0" /> Total: <span className="font-bold text-gray-700">₹{totalSpend.toLocaleString('en-IN')}</span></div>
            </div>
          </div>

          {/* Payment Table */}
          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-green-600" /> Payment Transactions
              </h3>
            </div>
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Vendor</th>
                  <th>Order Amount</th>
                  <th>Paid Amount</th>
                  <th>Balance Due</th>
                  <th>Payment Ref</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">No payment records for selected filters</td>
                  </tr>
                ) : filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td className="font-bold font-mono text-gray-900 text-sm">{order.po_number}</td>
                    <td className="font-medium text-gray-700">{order.vendor_name}</td>
                    <td className="font-bold text-gray-900">₹{order.amount.toLocaleString('en-IN')}</td>
                    <td className="font-bold text-green-700">
                      {order.paid_amount > 0 ? `₹${order.paid_amount.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className={`font-bold ${order.pending_amount > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                      {order.pending_amount > 0 ? `₹${order.pending_amount.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="font-mono text-xs text-gray-500">{order.payment_ref}</td>
                    <td><PayBadge status={order.payment_status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}
