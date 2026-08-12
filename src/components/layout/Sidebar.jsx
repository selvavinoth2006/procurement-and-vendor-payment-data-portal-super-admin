import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Building2, Store,
  ShieldCheck, ChevronRight, LogOut
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { apiService } from '../../services/api'

export const Sidebar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [pendingCounts, setPendingCounts] = useState({ orgs: 0, vendors: 0 })

  useEffect(() => {
    const fetchCounts = async () => {
      const orgs    = await apiService.getOrganizations()
      const vendors = await apiService.getVendors()
      setPendingCounts({
        orgs:    orgs.filter(o => o.status === 'Pending').length,
        vendors: vendors.filter(v => v.status === 'Pending').length,
      })
    }
    fetchCounts()
    const id = setInterval(fetchCounts, 15000)
    return () => clearInterval(id)
  }, [location.pathname])

  const navigation = [
    {
      name:  'Dashboard',
      path:  '/dashboard',
      icon:  LayoutDashboard,
      badge: null,
    },
    {
      name:  'Organization Governance',
      path:  '/approvals/organizations',
      icon:  Building2,
      badge: pendingCounts.orgs,
    },
    {
      name:  'Vendor Governance',
      path:  '/approvals/vendors',
      icon:  Store,
      badge: pendingCounts.vendors,
    },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 z-40 shrink-0">

      {/* Brand */}
      <div className="px-5 py-5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center shadow-sm shrink-0">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-extrabold text-gray-900 leading-none tracking-tight">
            Procure<span className="text-green-600">Hub</span>
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-bold tracking-widest text-green-600 uppercase">Super Admin</span>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="px-3 pb-3 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
          Menu
        </p>

        {navigation.map((item) => {
          const Icon     = item.icon
          const isActive = location.pathname === item.path

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 leading-tight">{item.name}</span>

              {item.badge > 0 ? (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white">
                  {item.badge}
                </span>
              ) : isActive ? (
                <ChevronRight className="w-4 h-4 opacity-50" />
              ) : null}
            </NavLink>
          )
        })}
      </nav>

      {/* Admin Profile Footer */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm shrink-0">
            {(user?.name || 'A').charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-gray-900 truncate">{user?.name || 'Super Admin'}</div>
            <div className="text-[10px] text-gray-400 truncate">{user?.email || 'admin@procurehub.com'}</div>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  )
}
