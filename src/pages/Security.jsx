import React, { useState } from 'react'
import {
  ShieldCheck, User, Lock, Key, Mail, Phone,
  CheckCircle2, AlertCircle, Eye, EyeOff, Save,
  Shield, Check, Sparkles, Clock, Globe
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export const Security = () => {
  const { user, updateProfile, updatePassword } = useAuth()

  // Profile Form State
  const [name, setName]     = useState(user?.name || 'ProcureHub Super Admin')
  const [email, setEmail]   = useState(user?.email || 'admin@procurehub.com')
  const [phone, setPhone]   = useState(user?.phone || '+91 98765 43210')
  const [title, setTitle]   = useState(user?.title || 'Super Admin Governance Lead')

  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })
  const [savingProfile, setSavingProfile] = useState(false)

  // Password Form State
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass]         = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [passMsg, setPassMsg]       = useState({ type: '', text: '' })
  const [savingPass, setSavingPass] = useState(false)

  // Profile submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileMsg({ type: '', text: '' })
    setSavingProfile(true)

    const res = await updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      title: title.trim(),
    })
    setSavingProfile(false)

    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Admin profile information updated successfully!' })
      setTimeout(() => setProfileMsg({ type: '', text: '' }), 5000)
    } else {
      setProfileMsg({ type: 'error', text: res.message || 'Failed to update profile.' })
    }
  }

  // Password submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPassMsg({ type: '', text: '' })

    if (newPass.length < 6) {
      setPassMsg({ type: 'error', text: 'New password must be at least 6 characters long.' })
      return
    }
    if (newPass !== confirmPass) {
      setPassMsg({ type: 'error', text: 'New password and confirmation password do not match.' })
      return
    }

    setSavingPass(true)
    const res = await updatePassword(currentPass, newPass)
    setSavingPass(false)

    if (res.success) {
      setPassMsg({ type: 'success', text: 'Security password changed successfully!' })
      setCurrentPass('')
      setNewPass('')
      setConfirmPass('')
      setTimeout(() => setPassMsg({ type: '', text: '' }), 5000)
    } else {
      setPassMsg({ type: 'error', text: res.message || 'Failed to update password.' })
    }
  }

  // Initials
  const initials = (name || 'SA').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  // Simple password strength
  const getPassStrength = (p) => {
    if (!p) return { score: 0, label: '', color: '' }
    if (p.length < 6) return { score: 1, label: 'Weak', color: 'bg-red-500' }
    if (p.length < 9) return { score: 2, label: 'Medium', color: 'bg-amber-500' }
    return { score: 3, label: 'Strong', color: 'bg-green-500' }
  }
  const strength = getPassStrength(newPass)

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">

      {/* Page Title */}
      <div>
        <h1 className="page-header flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-green-600" /> Account &amp; Security Settings
        </h1>
        <p className="page-sub">
          Manage your Super Admin profile details, credentials, password policy &amp; session security
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT COL: PROFILE & AVATAR (2 Cols) ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Profile Card */}
          <div className="card p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-green-600 flex items-center justify-center text-white text-base font-extrabold shadow-sm shrink-0">
                  {initials}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{name || 'Super Admin'}</h3>
                  <p className="text-xs text-green-700 font-medium mt-0.5">{title}</p>
                </div>
              </div>
              <span className="badge-approved">Super Admin Role</span>
            </div>

            {/* Profile Success / Error Alert */}
            {profileMsg.text && (
              <div className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
                profileMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span className="font-medium">{profileMsg.text}</span>
              </div>
            )}

            {/* Profile Form */}
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Admin Name"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="admin@procurehub.com"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Role / Title */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Role Title</label>
                  <div className="relative">
                    <Shield className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Super Admin Governance Lead"
                      className="form-input"
                    />
                  </div>
                </div>

              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-60"
                >
                  {savingProfile ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Profile Details
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Password & Credentials Card */}
          <div className="card p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Key className="w-5 h-5 text-green-600" />
              <div>
                <h3 className="font-bold text-gray-900 text-base">Change Password</h3>
                <p className="text-xs text-gray-400">Update your Super Admin access credentials</p>
              </div>
            </div>

            {/* Password Success / Error Alert */}
            {passMsg.text && (
              <div className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
                passMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {passMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span className="font-medium">{passMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              
              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Current Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    required
                    value={currentPass}
                    onChange={e => setCurrentPass(e.target.value)}
                    placeholder="Enter current password"
                    className="form-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password & Confirm Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">New Password</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNew ? 'text' : 'password'}
                      required
                      value={newPass}
                      onChange={e => setNewPass(e.target.value)}
                      placeholder="Min 6 characters"
                      className="form-input pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Strength Bar */}
                  {newPass && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span>Password Strength:</span>
                        <span className="font-bold text-gray-700">{strength.label}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden flex gap-1">
                        <div className={`h-full flex-1 ${strength.score >= 1 ? strength.color : 'bg-gray-200'}`} />
                        <div className={`h-full flex-1 ${strength.score >= 2 ? strength.color : 'bg-gray-200'}`} />
                        <div className={`h-full flex-1 ${strength.score >= 3 ? strength.color : 'bg-gray-200'}`} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      required
                      value={confirmPass}
                      onChange={e => setConfirmPass(e.target.value)}
                      placeholder="Re-enter new password"
                      className="form-input pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Match Indicator */}
                  {confirmPass && (
                    <div className="mt-2 text-[10px] flex items-center gap-1 font-semibold">
                      {newPass === confirmPass ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Passwords match
                        </span>
                      ) : (
                        <span className="text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Passwords do not match
                        </span>
                      )}
                    </div>
                  )}
                </div>

              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={savingPass}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-60"
                >
                  {savingPass ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* ── RIGHT COL: SECURITY PRIVILEGES & SESSION (1 Col) ── */}
        <div className="space-y-6">

          {/* Account Privileges */}
          <div className="card p-5 space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600" /> Admin Privileges &amp; Scope
            </h3>
            <div className="space-y-3 text-xs">
              {[
                { title: 'Organization Approvals', desc: 'Full authority to approve or reject enterprise buyer registrations' },
                { title: 'Vendor Governance', desc: 'Full authorization rights for supplier listings & catalog onboarding' },
                { title: 'Database Oversight', desc: 'Real-time read/write synchronization with Supabase Cloud' },
                { title: 'Audit Trail Access', desc: 'System-wide activity log recording for compliance audits' },
              ].map((priv, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-800 block">{priv.title}</span>
                    <span className="text-gray-400 text-[11px] leading-tight block mt-0.5">{priv.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
