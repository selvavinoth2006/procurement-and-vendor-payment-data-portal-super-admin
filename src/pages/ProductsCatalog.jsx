import React, { useState, useEffect } from 'react'
import { Package, Search, Filter, ArrowUpDown, Store, Boxes, Grid, List } from 'lucide-react'
import { apiService } from '../services/api'

export const ProductsCatalog = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [sortBy, setSortBy] = useState('price-desc')
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    const fetch = async () => { setLoading(true); const data = await apiService.getProducts(); setProducts(data); setLoading(false) }
    fetch()
  }, [])

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))]
  const processed = products
    .filter(p => {
      const matchesCat    = categoryFilter === 'All' || p.category === categoryFilter
      const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCat && matchesSearch
    })
    .sort((a, b) => sortBy === 'price-asc' ? a.price - b.price : sortBy === 'price-desc' ? b.price - a.price : a.name.localeCompare(b.name))

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="page-header flex items-center gap-2"><Package className="w-6 h-6 text-green-600" /> Global Products Catalog</h1>
          <p className="page-sub">All inventory items listed across approved vendor catalogs with price sorting & stock monitoring</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
          <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-800'}`}>
            <Grid className="w-3.5 h-3.5" /> Grid
          </button>
          <button onClick={() => setViewMode('table')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${viewMode === 'table' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-800'}`}>
            <List className="w-3.5 h-3.5" /> Table
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search product name, SKU, vendor..." className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="filter-select">
          {categories.map(cat => <option key={cat} value={cat}>Category: {cat}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="filter-select">
          <option value="price-desc">Price: High to Low</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="name">Name: A–Z</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48"><div className="w-7 h-7 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : processed.length === 0 ? (
        <div className="card p-16 text-center space-y-2"><Package className="w-10 h-10 text-gray-300 mx-auto" /><h3 className="font-semibold text-gray-500">No products found</h3></div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {processed.map(prod => (
            <div key={prod.id} className="card-hover overflow-hidden flex flex-col">
              <div className="h-40 overflow-hidden bg-gray-50">
                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">{prod.category}</span>
                  <h3 className="font-semibold text-gray-900 text-sm mt-1.5 leading-snug">{prod.name}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-2 border border-gray-100">
                  <Store className="w-3.5 h-3.5 text-green-500" />
                  <span className="truncate">{prod.vendor_name}</span>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Unit Price</span>
                    <span className="text-lg font-extrabold text-green-700">₹{Number(prod.price ?? prod.unit_price ?? prod.unitPrice ?? prod.cost ?? prod.rate ?? prod.amount ?? 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Stock</span>
                    <span className="text-xs font-bold text-teal-600 flex items-center gap-1"><Boxes className="w-3.5 h-3.5" />{prod.stock ?? prod.stock_quantity ?? prod.quantity ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full data-table">
            <thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Vendor</th><th>Stock</th><th className="text-right">Unit Price</th></tr></thead>
            <tbody>
              {processed.map(prod => (
                <tr key={prod.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-xl object-cover border border-gray-100 shrink-0" />
                      <span className="font-semibold text-gray-900 text-sm">{prod.name}</span>
                    </div>
                  </td>
                  <td className="font-mono text-gray-400 text-xs">{prod.sku}</td>
                  <td><span className="text-xs font-semibold text-green-700">{prod.category}</span></td>
                  <td>{prod.vendor_name}</td>
                  <td className="font-bold text-teal-600">{prod.stock ?? prod.stock_quantity ?? prod.quantity ?? 0} units</td>
                  <td className="text-right font-extrabold text-green-700 text-sm">₹{Number(prod.price ?? prod.unit_price ?? prod.unitPrice ?? prod.cost ?? prod.rate ?? prod.amount ?? 0).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
