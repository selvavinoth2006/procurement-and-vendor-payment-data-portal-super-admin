import React from 'react'
import { X, Package, Store, Tag, Boxes, IndianRupee, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react'

const DEFAULT_CATEGORY_IMAGES = {
  'IT Infrastructure & Hardware':      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80',
  'Hardware & Raw Materials':          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
  'IT & Software Services':           'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
  'Industrial Chemicals & Safety':     'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=500&auto=format&fit=crop&q=80',
  'Office Equipment & Furniture':      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&auto=format&fit=crop&q=80',
  'IT Security & Cybersecurity':       'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=80',
  'Renewable Energy & Infrastructure': 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=500&auto=format&fit=crop&q=80',
}

export const getProductImg = (product) => {
  if (!product) return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=80'
  const explicit = product.image || product.image_url || product.img_url || product.photo_url || product.photo || product.url
  if (explicit && typeof explicit === 'string' && explicit.trim().length > 0) return explicit
  return DEFAULT_CATEGORY_IMAGES[product.category] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=80'
}

export const ProductDetailModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null

  const fallbackImg = DEFAULT_CATEGORY_IMAGES[product.category] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=80'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh] my-auto relative z-[101]">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-100 border border-green-200 flex items-center justify-center text-green-700 font-bold shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 leading-tight">Product Specification</h3>
              <p className="text-xs text-gray-400 font-mono">SKU: {product.sku || 'N/A'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm flex-1">

          {/* Product Image & Title Header */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <img
              src={getProductImg(product)}
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = fallbackImg
              }}
              className="w-24 h-24 object-cover rounded-xl border border-gray-200 shrink-0 bg-white shadow-sm"
            />
            <div className="flex-1 space-y-1.5 text-center sm:text-left min-w-0">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                {product.category || 'General'}
              </span>
              <h4 className="font-bold text-base text-gray-900 leading-tight">{product.name}</h4>
              <p className="text-xs text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                <Store className="w-3.5 h-3.5 text-green-500" /> Supplied by <span className="font-semibold text-gray-800">{product.vendor_name || 'Vendor Partner'}</span>
              </p>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Unit Price</span>
              <p className="text-base font-extrabold text-green-700">
                ₹{Number(product.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Stock Quantity</span>
              <p className="text-base font-extrabold text-teal-700 flex items-center gap-1">
                <Boxes className="w-4 h-4" /> {product.stock || 0} units
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Catalog Status</span>
              <div className="pt-0.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                  <CheckCircle2 className="w-3 h-3" /> {product.status || 'Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Product Description</span>
            <p className="text-xs text-gray-600 leading-relaxed">
              {product.description || `${product.name} supplied by ${product.vendor_name || 'vendor'} under ${product.category || 'general'} category. Quality verified for enterprise procurement orders.`}
            </p>
          </div>

          {/* Compliance & SKU details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
              <span className="text-gray-400">SKU Code:</span>
              <span className="font-mono font-bold text-gray-800">{product.sku || 'N/A'}</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
              <span className="text-gray-400">Vendor ID:</span>
              <span className="font-mono font-bold text-gray-800">{product.vendor_id || 'N/A'}</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Close Specification
          </button>
        </div>

      </div>
    </div>
  )
}
