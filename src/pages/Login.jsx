import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react'

export const Login = () => {
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [error, setError]         = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    const result = await login(email, password)
    setIsSubmitting(false)
    if (result.success) navigate('/dashboard')
    else setError(result.message || 'Login failed')
  }

  const handleDemoFill = () => {
    setEmail('admin@procurehub.com')
    setPassword('password123')
    setError('')
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #dcfce7 50%, #d1fae5 100%)' }}
    >

      {/* "← to Home" link */}
      <div className="absolute top-5 left-6">
        <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-700 font-medium transition-colors">
          <ArrowRight className="w-4 h-4 rotate-180" /> to Home
        </Link>
      </div>

      {/* Brand mark */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-600 shadow-brand mb-4">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Procure<span className="text-green-600">Hub</span>
        </h1>
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <Sparkles className="w-3.5 h-3.5 text-green-600" />
          <span className="text-xs font-bold tracking-widest text-green-700 uppercase">
            Super Admin Governance Portal
          </span>
        </div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card-lg border border-green-100 p-8 space-y-5">

        {/* Card title */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-4 h-4 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">Sign In to Your Workspace</h2>
          </div>
          <p className="text-xs text-gray-400 pl-6">Enter your Super Admin credentials to continue</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="form-input"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-60 group"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        </div>

    </div>
  )
}
