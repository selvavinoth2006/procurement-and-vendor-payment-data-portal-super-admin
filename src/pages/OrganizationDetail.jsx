import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Building2, Mail, Phone, MapPin, FileText,
  ShoppingBag, IndianRupee, Truck, CreditCard,
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
  const [activeTab, setActiveTab] = useState('orders')

  // Filter state
  const [filterMonth, setFilterMonth] = useState('All')
  const [filterYear,  setFilterYear]  = useState('All')
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
  const totalSpend   = orders.reduce((s, o) => s + o.amount, 0)
  const totalPaid    = orders.reduce((s, o) => s + (o.paid_amount  || 0), 0)
  const totalPending = orders.reduce((s, o) => s + (o.pending_amount || 0), 0)
  const delivered    = orders.filter(o => o.delivery_status === 'Delivered').length
  const inTransit    = orders.filter(o => o.delivery_status === 'In Transit' || o.delivery_status === 'Out for Delivery').length

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
            <span className={
              org.status === 'Approved' ? 'badge-approved text-sm px-3 py-1' :
              org.status === 'Rejected' ? 'badge-rejected text-sm px-3 py-1' : 'badge-pending text-sm px-3 py-1'
            }>
              {org.status}
            </span>
          </div>
          <p className="page-sub">{org.industry} · {org.email} · GSTIN: {org.gstin || 'N/A'}</p>
        </div>
      </div>

      {/* ── Org Info Cards row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Mail,     label: 'Email',    value: org.email },
          { icon: Phone,    label: 'Phone',    value: org.phone },
          { icon: FileText, label: 'GSTIN',    value: org.gstin || 'N/A' },
          { icon: MapPin,   label: 'Address',  value: org.address },
        ].map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i} className="card px-4 py-3 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{item.label}</p>
                <p className="text-xs font-semibold text-gray-800 truncate mt-0.5">{item.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Summary Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total Orders',   value: orders.length,          icon: ShoppingBag, color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-100' },
          { label: 'Total Spend',    value: `₹${totalSpend.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-100' },
          { label: 'Amount Paid',    value: `₹${totalPaid.toLocaleString('en-IN')}`,  icon: CreditCard, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Pending Payment',value: `₹${totalPending.toLocaleString('en-IN')}`, icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100' },
          { label: 'Delivered',      value: `${delivered} / ${orders.length}`,        icon: Truck, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100' },
        ].map((c, i) => {
          const Icon = c.icon
          return (
            <div key={i} className={`card px-4 py-3 border ${c.border} flex items-center gap-3`}>
              <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center ${c.color} shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide leading-tight">{c.label}</p>
                <p className={`text-base font-extrabold ${c.color} leading-tight mt-0.5 truncate`}>{c.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { key: 'orders',   label: 'Orders & Delivery' },
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

      {/* ── FILTERS ROW ── */}
      <div className="card p-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
          <Filter className="w-3.5 h-3.5" /> Filter by:
        </div>

        {/* Year */}
        <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="filter-select text-xs">
          <option value="All">All Years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        {/* Month */}
        <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="filter-select text-xs">
          <option value="All">All Months</option>
          {months.map(m => {
            const [yr, mn] = m.split('-')
            return <option key={m} value={m}>{MONTH_LABELS[mn]} {yr}</option>
          })}
        </select>

        {/* Order Status */}
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="filter-select text-xs">
          <option value="All">All Statuses</option>
          <option value="Disbursed">Disbursed</option>
          <option value="Fulfilled">Fulfilled</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
        </select>

        {/* Reset */}
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

      {/* ── ORDERS & DELIVERY TAB ── */}
      {activeTab === 'orders' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-green-600" /> Purchase Orders & Delivery Status
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
                  <td colSpan={6} className="text-center py-12">
                    <ShoppingBag className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 font-medium">No orders for the selected filters</p>
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
      )}

      {/* ── PAYMENTS TAB ── */}
      {activeTab === 'payments' && (
        <div className="space-y-4">

          {/* Payment summary bar */}
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

          {/* Payment table */}
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
