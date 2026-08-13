import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, CheckCircle2, AlertCircle } from 'lucide-react'

const INDUSTRIES = [
  'Information Technology',
  'Healthcare & Pharma',
  'Construction & Infrastructure',
  'Logistics & Transport',
  'FMCG & Retail',
  'Financial Services',
  'Manufacturing & Heavy Industry',
  'Education & Research',
  'Hardware & Raw Materials',
]

export const AddOrganizationModal = ({ isOpen, onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    industry: INDUSTRIES[0],
    gstin: '',
    address: '',
    status: 'Approved'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        industry: INDUSTRIES[0],
        gstin: '',
        address: '',
        status: 'Approved'
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
      setError('Organization name is required.')
      return
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid business email address.')
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
      setError(err.message || 'Failed to create organization.')
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
            <h3 className="text-xl font-bold text-slate-900 leading-tight">Add New Organization</h3>
            <p className="text-xs text-slate-500 mt-1">
              Default password for new account will be <span className="font-mono font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">123456</span>
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

              {/* Company Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Apex Global Technologies Ltd"
                  className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 font-medium transition-all"
                  required
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
                  placeholder="procurement@company.com"
                  className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 font-medium transition-all"
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
                  placeholder="+91 98765 43210"
                  className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 font-medium transition-all"
                />
              </div>

              {/* Industry Sector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Industry Sector
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm text-slate-800 bg-slate-50/50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 font-medium transition-all"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              {/* GSTIN Identification */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  GSTIN Identification
                </label>
                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  placeholder="27AAACA1234A1Z5"
                  className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm font-mono text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 font-medium uppercase transition-all"
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
                      value="Approved"
                      checked={formData.status === 'Approved'}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <span className="px-3 py-1 rounded-lg bg-green-100 text-green-800 border border-green-200 font-bold">Approved</span>
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

              {/* Registered Operating Address */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Registered Operating Address
                </label>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full business street address, tower/building, city, state & postal code..."
                  className="w-full border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 font-medium resize-none transition-all"
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
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors shadow-sm disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Add Organization
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
