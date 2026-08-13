import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Store, Mail, Phone, MapPin, FileText,
  User, Award, Package, ShoppingBag, IndianRupee,
  Truck, CreditCard, CheckCircle2, Clock, Eye, RefreshCw,
  Boxes, Star, ExternalLink, Filter, TrendingUp
} from 'lucide-react'
import { apiService } from '../services/api'
import { ProductDetailModal, getProductImg } from '../components/modals/ProductDetailModal'

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
      {status}
    </span>
  )
}

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

export const VendorDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [vendor, setVendor]     = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [activeTab, setActiveTab] = useState('details')

  // Selected Product for modal inspection
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productModalOpen, setProductModalOpen] = useState(false)

  // Filters for orders
  const [filterMonth, setFilterMonth]   = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [venData, prodData, orderData] = await Promise.all([
        apiService.getVendorById(id),
        apiService.getVendorProducts(id),
        apiService.getVendorOrders(id),
      ])
      setVendor(venData)
      setProducts(prodData)
      setOrders(orderData)
      setLoading(false)
    }
    load()
  }, [id])

  // Summary stats
  const totalFulfillmentVal = orders.reduce((s, o) => s + (o.amount || 0), 0)
  const totalPaid          = orders.reduce((s, o) => s + (o.paid_amount || 0), 0)
  const totalPending       = orders.reduce((s, o) => s + (o.pending_amount || 0), 0)

  const months = [...new Set(orders.map(o => o.month))].sort((a, b) => b.localeCompare(a))
  const filteredOrders = orders.filter(o => {
    const mMonth  = filterMonth  === 'All' || o.month  === filterMonth
    const mStatus = filterStatus === 'All' || o.status === filterStatus
    return mMonth && mStatus
  })

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!vendor) return (
    <div className="card p-16 text-center space-y-2">
      <Store className="w-12 h-12 text-gray-200 mx-auto" />
      <p className="text-gray-500 font-semibold">Vendor not found</p>
      <button onClick={() => navigate('/approvals/vendors')} className="text-green-600 text-sm hover:underline">← Back to list</button>
    </div>
  )

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Back & Header ── */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => navigate('/approvals/vendors')}
          className="mt-1 p-2 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-500 hover:text-green-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="page-header">{vendor.name}</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              {vendor.category}
            </span>
            <span className={
              vendor.status === 'Approved' ? 'badge-approved text-sm px-3 py-1' :
              vendor.status === 'Rejected' ? 'badge-rejected text-sm px-3 py-1' : 'badge-pending text-sm px-3 py-1'
            }>
              {vendor.status}
            </span>
          </div>
          <p className="page-sub">Supplier ID: {vendor.id} · Key Contact: {vendor.contact_person || 'N/A'}</p>
        </div>
      </div>

      {/* ── Quick Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="card px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Catalog Products</p>
            <p className="text-base font-extrabold text-teal-700">{products.length} listed</p>
          </div>
        </div>
        <div className="card px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Fulfilled Orders</p>
            <p className="text-base font-extrabold text-green-700">{orders.length} orders</p>
          </div>
        </div>
        <div className="card px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <IndianRupee className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Volume Value</p>
            <p className="text-base font-extrabold text-emerald-700">₹{totalFulfillmentVal.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="card px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Star className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Performance Score</p>
            <p className="text-base font-extrabold text-amber-700">{vendor.rating || 90}% rating</p>
          </div>
        </div>
      </div>

      {/* ── Main Tab Navigation ── */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { key: 'details',  label: 'Vendor Profile Details' },
          { key: 'products', label: `Products Catalog (${products.length})` },
          { key: 'orders',   label: `Orders & Payments (${orders.length})` },
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

      {/* ── TAB 1: DETAILS ── */}
      {activeTab === 'details' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Contact Card */}
            <div className="card p-5 space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <User className="w-4 h-4 text-green-600" /> Contact Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Contact Person:</span>
                  <span className="font-semibold text-gray-800">{vendor.contact_person || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Email Address:</span>
                  <span className="font-medium text-gray-700">{vendor.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Phone Number:</span>
                  <span className="font-medium text-gray-700">{vendor.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Category:</span>
                  <span className="font-semibold text-blue-700">{vendor.category}</span>
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
                    {vendor.gstin || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">PAN Card:</span>
                  <span className="font-mono font-bold bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-lg text-green-700 text-xs">
                    {vendor.pan || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Governance Status:</span>
                  <span className={vendor.status === 'Approved' ? 'badge-approved' : vendor.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}>
                    {vendor.status}
                  </span>
                </div>
                {vendor.rejection_reason && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 mt-2">
                    <span className="font-bold block">Rejection Note:</span>
                    {vendor.rejection_reason}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Address & Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-5 space-y-2">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <MapPin className="w-4 h-4 text-green-600" /> Physical Operating Address
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed pt-1">
                {vendor.address || 'Address information not provided.'}
              </p>
            </div>

            <div className="card p-5 space-y-3">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Award className="w-4 h-4 text-green-600" /> Rating &amp; Performance
              </h3>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Compliance &amp; Quality Rating</span>
                  <span className="font-extrabold text-green-700">{vendor.rating || 90}%</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full transition-all"
                    style={{ width: `${vendor.rating || 90}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: PRODUCTS ── */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-green-600" /> Vendor Catalog Items
            </h3>
            <span className="text-xs text-gray-400">Click any product card for complete specifications</span>
          </div>

          {products.length === 0 ? (
            <div className="card p-16 text-center space-y-2">
              <Package className="w-10 h-10 text-gray-200 mx-auto" />
              <p className="text-gray-400 font-medium">No products listed by this vendor yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(prod => (
                <div
                  key={prod.id}
                  onClick={() => { setSelectedProduct(prod); setProductModalOpen(true) }}
                  className="card-hover p-4 flex flex-col justify-between space-y-3 cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={getProductImg(prod)}
                      alt={prod.name}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=80'
                      }}
                      className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0 bg-white shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                        {prod.category}
                      </span>
                      <h4 className="font-bold text-sm text-gray-900 mt-1 truncate group-hover:text-green-700 transition-colors">
                        {prod.name}
                      </h4>
                      <p className="text-xs font-mono text-gray-400">SKU: {prod.sku}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">Price</span>
                      <span className="text-sm font-extrabold text-green-700">₹{Number(prod.price ?? prod.unit_price ?? prod.unitPrice ?? prod.cost ?? prod.rate ?? prod.amount ?? 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">Stock</span>
                      <span className="text-xs font-bold text-teal-600 flex items-center gap-1">
                        <Boxes className="w-3 h-3" /> {prod.stock ?? prod.stock_quantity ?? prod.quantity ?? prod.stock_qty ?? prod.qty ?? 0} units
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedProduct(prod); setProductModalOpen(true) }}
                    className="w-full py-1.5 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-200 rounded-xl text-xs font-medium text-gray-600 hover:text-green-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Product Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: ORDERS & PAYMENTS ── */}
      {activeTab === 'orders' && (
        <div className="space-y-4">

          {/* Orders Filter Bar */}
          <div className="card p-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
              <Filter className="w-3.5 h-3.5" /> Filter Orders:
            </div>
            <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="filter-select text-xs">
              <option value="All">All Months</option>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="filter-select text-xs">
              <option value="All">All Order Statuses</option>
              <option value="Disbursed">Disbursed</option>
              <option value="Approved">Approved</option>
              <option value="Fulfilled">Fulfilled</option>
              <option value="Pending">Pending</option>
            </select>
            <span className="ml-auto text-xs text-gray-400 font-medium">
              Showing {filteredOrders.length} of {orders.length} orders
            </span>
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Buyer Organization</th>
                  <th>Order Value</th>
                  <th>Order Status</th>
                  <th>Delivery Status</th>
                  <th>Payment Ref / Details</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      No purchase orders match current filters
                    </td>
                  </tr>
                ) : filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td>
                      <div className="font-bold text-gray-900 font-mono text-sm">{order.po_number}</div>
                      <div className="text-xs text-gray-400">{order.items_count} items</div>
                    </td>
                    <td className="font-medium text-gray-700">{order.buyer_name}</td>
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
                    <td>
                      <div className="space-y-0.5">
                        <PayBadge status={order.payment_status} />
                        <div className="font-mono text-[11px] text-gray-400 mt-1">{order.payment_ref}</div>
                      </div>
                    </td>
                    <td className="text-gray-500 font-medium">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Product Details Modal */}
      <ProductDetailModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        product={selectedProduct}
      />

    </div>
  )
}
