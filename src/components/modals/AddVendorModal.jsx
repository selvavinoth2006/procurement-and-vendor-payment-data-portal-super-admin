import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, CheckCircle2, AlertCircle } from 'lucide-react'

const VENDOR_CATEGORIES = [
  'IT Infrastructure & Hardware',
  'Hardware & Raw Materials',
  'IT & Software Services',
  'Industrial Chemicals & Safety',
  'Office Equipment & Furniture',
  'IT Security & Cybersecurity',
  'Renewable Energy & Infrastructure',
  'Logistics & Packaging',
]

export const AddVendorModal = ({ isOpen, onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    category: VENDOR_CATEGORIES[0],
    gstin: '',
    pan: '',
    address: '',
    status: 'Active'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        category: VENDOR_CATEGORIES[0],
        gstin: '',
        pan: '',
        address: '',
        status: 'Active'
      })
      setError('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setError('Vendor company name is required.')
      return
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid vendor email address.')
      return
    }

    setIsSubmitting(true)
    try {
      await onCreated({
        ...formData,
        password: '123456'
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create vendor.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden my-auto relative z-[10000] animate-fade-in">

        {/* Modal Header */}
        <div className="px-7 py-4 sm:py-5 border-b border-slate-100 flex items-start justify-between bg-white shrink-0">
          <div>
            <h3 className="text-xl font-bold text-slate-900 leading-tight">Add New Supplier / Vendor</h3>
            <p className="text-xs text-slate-500 mt-1">
              Default password for new supplier account will be <span className="font-mono font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">123456</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
          <div className="p-6 sm:p-7 overflow-y-auto flex-1 space-y-5">

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Strict 2-Column Grid for Paired Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

              {/* Vendor Company Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Vendor Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="OmniSys Hardware Systems"
                  className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 font-medium transition-all"
                  required
                />
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  placeholder="Rajesh Sharma"
                  className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 font-medium transition-all"
                />
              </div>

              {/* Official Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Official Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="sales@vendor.co.in"
                  className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 font-medium transition-all"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98111 22334"
                  className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 font-medium transition-all"
                />
              </div>

              {/* Supply Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Supply Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 font-medium transition-all"
                >
                  {VENDOR_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* GSTIN Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  GSTIN Number
                </label>
                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  placeholder="27AAACF5544E1Z6"
                  className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm font-mono text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 font-medium uppercase transition-all"
                />
              </div>

              {/* PAN Identification */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  PAN Identification
                </label>
                <input
                  type="text"
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  placeholder="AAACF5544E"
                  className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm font-mono text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 font-medium uppercase transition-all"
                />
              </div>

              {/* Governance Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Governance Status
                </label>
                <div className="flex items-center gap-4 h-11">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Active"
                      checked={formData.status === 'Active' || formData.status === 'Approved'}
                      onChange={handleChange}
                      className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="px-3 py-1 rounded-lg bg-teal-100 text-teal-800 border border-teal-200 font-bold">Active</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Pending"
                      checked={formData.status === 'Pending'}
                      onChange={handleChange}
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-200 font-bold">Pending</span>
                  </label>
                </div>
              </div>

              {/* Factory Address */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Factory / Operating Physical Address
                </label>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full physical street address, MIDC/industrial zone, city, state & postal code..."
                  className="w-full border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 font-medium resize-none transition-all"
                />
              </div>

            </div>
          </div>

          {/* Sticky Footer with Divider */}
          <div className="px-7 py-4 border-t border-slate-100 bg-white flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-sm disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Add Supplier
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>,
    document.body
  )
}
