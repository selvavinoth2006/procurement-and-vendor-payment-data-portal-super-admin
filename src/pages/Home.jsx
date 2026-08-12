import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ShieldCheck, Building2, Store, Package, 
  ShoppingBag, BarChart3, ChevronRight, ArrowRight,
  Layers, CheckCircle2, Globe, Lock, Zap
} from 'lucide-react'

export const Home = () => {
  const navigate = useNavigate()

  const features = [
    { icon: Building2,   color: 'bg-green-100 text-green-700',  title: 'Organization Governance', desc: 'Review and approve buyer organizations with full GSTIN compliance verification.' },
    { icon: Store,       color: 'bg-teal-100 text-teal-700',    title: 'Vendor Approvals',         desc: 'Authorize supplier onboarding with PAN, GSTIN, and category validation.' },
    { icon: BarChart3,   color: 'bg-emerald-100 text-emerald-700', title: 'Executive Dashboard',   desc: 'Real-time metrics on total spend, POs, registered orgs, and vendors.' },
    { icon: Package,     color: 'bg-lime-100 text-lime-700',    title: 'Global Catalog Oversight', desc: 'Browse all products across every approved vendor catalog with price sorting.' },
    { icon: ShoppingBag, color: 'bg-green-100 text-green-700',  title: 'Orders & Transactions',   desc: 'Monitor POs, invoices, and payment disbursements across the entire platform.' },
    { icon: Globe,       color: 'bg-teal-100 text-teal-700',    title: 'Platform-Wide Control',   desc: 'Single pane of glass for all buyers, vendors, and procurement activities.' },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #dcfce7 50%, #d1fae5 100%)' }}>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center shadow-brand">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">Procure<span className="text-green-600">Hub</span></span>
              <div className="text-[10px] font-semibold text-green-600 tracking-widest uppercase -mt-0.5">Super Admin Portal</div>
            </div>
          </div>

          {/* Nav CTA */}
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl shadow-brand transition-all"
          >
            <Lock className="w-4 h-4" /> Admin Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 border border-green-200 rounded-full text-xs font-semibold text-green-700 mb-8">
          <Zap className="w-3.5 h-3.5" /> Enterprise Procurement & Vendor Governance Platform
        </div>

        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-5 max-w-3xl mx-auto">
          ProcureHub <span className="text-green-600">Super Admin</span> Control Center
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mb-10">
          A powerful single-pane governance portal to oversee all buyer organizations, vendor onboarding approvals, global procurement spend, and purchase order lifecycle management.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2.5 px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-brand transition-all text-base group"
          >
            Access Admin Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-8 py-3.5 bg-white border border-gray-200 hover:border-green-300 text-gray-700 hover:text-green-700 font-semibold rounded-xl transition-all text-base"
          >
            View Dashboard
          </Link>
        </div>
      </section>

      {/* Stats Row */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-2xl shadow-card-md border border-green-100 p-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {[
            { label: 'Buyer Organizations', value: 'Full Oversight' },
            { label: 'Vendor Approvals',    value: 'Live Queue' },
            { label: 'Procurement Spend',   value: '₹ Platform-Wide' },
            { label: 'Purchase Orders',     value: 'All PO Tracking' },
          ].map((s, i) => (
            <div key={i} className="px-6 first:pl-0 last:pr-0 text-center py-2">
              <div className="text-sm font-semibold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Everything you need to govern ProcureHub</h2>
          <p className="text-gray-500 mt-2">Complete administrative control across the entire procurement ecosystem</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <div key={i} className="card-hover p-6 flex flex-col gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${f.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
                <div className="mt-auto pt-2">
                  <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                    Explore <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-green-600 rounded-3xl p-12 text-center text-white shadow-brand">
          <h2 className="text-3xl font-bold mb-3">Ready to govern ProcureHub?</h2>
          <p className="text-green-100 text-base mb-8 max-w-lg mx-auto">
            Sign in with your Super Admin credentials to access the full governance control panel.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-all group"
          >
            <Lock className="w-4 h-4" /> Sign In to Admin Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-100 bg-white/60 backdrop-blur-sm py-6 text-center text-xs text-gray-400">
        © 2026 ProcureHub Inc. Enterprise Procurement & Governance Platform &bull; Protected by AES-256 Encryption
      </footer>

    </div>
  )
}
