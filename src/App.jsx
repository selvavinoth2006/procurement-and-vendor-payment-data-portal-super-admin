import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { OrgApprovals } from './pages/OrgApprovals'
import { VendorApprovals } from './pages/VendorApprovals'
import { OrganizationDetail } from './pages/OrganizationDetail'
import { VendorDetail } from './pages/VendorDetail'
import { Security } from './pages/Security'

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/"      element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Super Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard"               element={<Dashboard />} />
              <Route path="/approvals/organizations" element={<OrgApprovals />} />
              <Route path="/approvals/vendors"       element={<VendorApprovals />} />
              <Route path="/organizations/:id"       element={<OrganizationDetail />} />
              <Route path="/vendors/:id"             element={<VendorDetail />} />
              <Route path="/security"                element={<Security />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
