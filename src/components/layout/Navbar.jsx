import React, { useState } from 'react'
import { Search, X, ChevronDown, LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { apiService } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export const Navbar = () => {
  const [searchQuery, setSearchQuery]   = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults]   = useState(false)
  const [showProfile, setShowProfile]   = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (!query.trim()) { setSearchResults([]); setShowResults(false); return }
    setShowResults(true)

    const [orgs, vendors, products, orders] = await Promise.all([
      apiService.getOrganizations(),
      apiService.getVendors(),
      apiService.getProducts(),
      apiService.getOrders(),
    ])
    const q = query.toLowerCase()
    const results = [
      ...orgs.filter(o    => o.name?.toLowerCase().includes(q)).map(o => ({ label: o.name,       sub: o.email,       type: 'Organization', link: '/organizations' })),
      ...vendors.filter(v => v.name?.toLowerCase().includes(q)).map(v => ({ label: v.name,       sub: v.category,    type: 'Vendor',       link: '/vendors' })),
      ...products.filter(p=> p.name?.toLowerCase().includes(q)).map(p => ({ label: p.name,       sub: p.vendor_name, type: 'Product',      link: '/products' })),
      ...orders.filter(o  => o.po_number?.toLowerCase().includes(q)).map(o => ({ label: o.po_number, sub: o.buyer_name, type: 'Order',      link: '/orders' })),
    ].slice(0, 6)
    setSearchResults(results)
  }

  const clear = () => { setSearchQuery(''); setSearchResults([]); setShowResults(false) }

  const initials = (user?.name || 'SA').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_0_0_#f3f4f6]">

      {/* Global Search */}
      <div className="relative w-80">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search organizations, vendors, POs..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-sm text-gray-700 placeholder-gray-400
                     focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
        />
        {searchQuery && (
          <button onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Search dropdown */}
        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-50">
            {searchResults.length === 0 ? (
              <div className="p-3 text-center text-xs text-gray-400">No results found.</div>
            ) : (
              searchResults.map((r, i) => (
                <div
                  key={i}
                  onClick={() => { navigate(r.link); clear() }}
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-green-50 cursor-pointer text-sm transition-colors border-b border-gray-50 last:border-0"
                >
                  <div>
                    <span className="font-medium text-gray-900 block">{r.label}</span>
                    <span className="text-xs text-gray-400">{r.sub}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                    {r.type}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right side — Profile */}
      <div className="relative">
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
        >
          {/* Avatar circle with initials */}
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
            {initials}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-semibold text-gray-800 leading-tight">{user?.name || 'Super Admin'}</div>
            <div className="text-[11px] text-gray-400 leading-tight">{user?.role === 'super_admin' ? 'Super Admin' : user?.role}</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
        </button>

        {/* Dropdown menu */}
        {showProfile && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden z-50">
              {/* Profile info header */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Super Admin'}</div>
                    <div className="text-xs text-gray-400 truncate">{user?.email || 'admin@procurehub.com'}</div>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-1.5">
                <button
                  onClick={() => { setShowProfile(false); logout() }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>

    </header>
  )
}
