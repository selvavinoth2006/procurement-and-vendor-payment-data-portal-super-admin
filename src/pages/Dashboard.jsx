import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Building2, Store, IndianRupee, ShoppingBag,
  AlertTriangle, CheckCircle2, RefreshCw, ChevronRight,
  TrendingUp, ShieldCheck, Activity, Clock, ArrowUpRight
} from 'lucide-react'
import { apiService } from '../services/api'

export const Dashboard = () => {
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const data = await apiService.getDashboardStats()
    setStats(data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  if (loading || !stats) return (
    <div className="flex items-center justify-center h-96">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin border-[3px]"></div>
        <span className="text-sm text-gray-400">Loading dashboard...</span>
      </div>
    </div>
  )

  const statCards = [
    { title: 'Total Organizations', value: stats.totalOrgs,    icon: Building2,   color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100' },
    { title: 'Total Vendors',       value: stats.totalVendors, icon: Store,       color: 'text-teal-600',   bg: 'bg-teal-50',   border: 'border-teal-100'  },
    { title: 'Platform Spend',      value: `₹${stats.totalSpend.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { title: 'Purchase Orders',     value: stats.totalOrders,  icon: ShoppingBag, color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-100' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Super Admin Executive Dashboard</h1>
          <p className="page-sub">Real-time governance overview · Compliance approvals · Financial transaction volume</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-green-300 rounded-xl text-sm font-medium text-gray-600 hover:text-green-700 transition-all shadow-card">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Pending Approval Alerts */}
      {(stats.pendingOrgsCount > 0 || stats.pendingVendorsCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.pendingOrgsCount > 0 ? (
            <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Pending Organization Approvals</p>
                  <p className="text-xs text-amber-700"><span className="font-bold">{stats.pendingOrgsCount} signup{stats.pendingOrgsCount > 1 ? 's' : ''}</span> awaiting compliance review</p>
                </div>
              </div>
              <Link to="/approvals/organizations" className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl transition-colors">
                Review <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Organizations Clear</p>
                <p className="text-xs text-green-700">All company signups have been verified</p>
              </div>
            </div>
          )}

          {stats.pendingVendorsCount > 0 ? (
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Pending Vendor Approvals</p>
                  <p className="text-xs text-blue-700"><span className="font-bold">{stats.pendingVendorsCount} supplier{stats.pendingVendorsCount > 1 ? 's' : ''}</span> awaiting tax & catalog verification</p>
                </div>
              </div>
              <Link to="/approvals/vendors" className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors">
                Review <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Vendor Queue Clear</p>
                <p className="text-xs text-green-700">All supplier verifications are up to date</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon
          return (
            <div key={i} className={`card p-5 border ${card.border} flex flex-col gap-3`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{card.title}</span>
                <div className={`w-8 h-8 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className={`text-2xl font-extrabold ${card.color} tracking-tight`}>{card.value}</div>
                <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
                  <TrendingUp className="w-3 h-3 text-green-500" /> Platform-wide total
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Activity Feed + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Activity Log */}
        <div className="lg:col-span-2 card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-green-600" />
              <h3 className="font-semibold text-gray-900">Recent Platform Activity</h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 uppercase tracking-wider">Live</span>
          </div>

          <div className="space-y-2.5">
            {stats.activities && stats.activities.length > 0 ? (
              stats.activities.slice(0, 5).map((act) => (
                <div key={act.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    act.type === 'approval'  ? 'bg-green-100 text-green-600' :
                    act.type === 'rejection' ? 'bg-red-100 text-red-500'    :
                    act.type === 'order'     ? 'bg-amber-100 text-amber-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {act.type === 'approval' ? <ShieldCheck className="w-4 h-4" /> :
                     act.type === 'order'    ? <ShoppingBag className="w-4 h-4" /> :
                     <Clock className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-800">{act.title}</h4>
                      <span className="text-[11px] text-gray-400 shrink-0 ml-2">{act.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{act.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-2">
                  <Activity className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-gray-600">No Recent Activity</p>
                <p className="text-xs text-gray-400 mt-0.5">Platform activity logs will appear here as actions occur.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="card p-5 space-y-4">
          <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Quick Access</h3>
          <div className="space-y-2">
            {[
              { label: 'Organization Governance', sub: 'All company registrations', link: '/approvals/organizations', icon: Building2 },
              { label: 'Vendor Governance',       sub: 'All supplier registrations', link: '/approvals/vendors',       icon: Store       },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.link}
                  to={item.link}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-green-50 transition-colors group border border-gray-100 hover:border-green-200"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-green-600 shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-gray-800 block">{item.label}</span>
                      <span className="text-xs text-gray-400">{item.sub}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-green-500 transition-colors" />
                </Link>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
