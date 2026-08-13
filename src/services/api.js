import { supabase } from '../lib/supabase'

// Initial Datasets (Empty to rely purely on real database and real user submissions)
const INITIAL_ORGANIZATIONS = []
const INITIAL_VENDORS = []
const INITIAL_PRODUCTS = []
const INITIAL_ORDERS = []
const INITIAL_ACTIVITIES = []

// Local state helpers
const getLocalData = (key, initial) => {
  try {
    const saved = localStorage.getItem(`procurehub_${key}`)
    if (!saved) return initial
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed)) return initial

    // Filter out old mock items (org-101..105, ven-201..205, prod-301..306, po-401..405) AND stub items without name
    return parsed.filter(item => {
      if (!item || typeof item !== 'object') return false
      if (!item.name || String(item.name).trim() === '') return false
      const id = String(item.id || '')
      return !id.startsWith('org-10') && !id.startsWith('ven-20') && !id.startsWith('prod-30') && !id.startsWith('po-40')
    })
  } catch (e) {
    return initial
  }
}

const setLocalData = (key, data) => {
  try {
    const validData = Array.isArray(data) ? data.filter(item => item && item.name && String(item.name).trim() !== '') : data
    localStorage.setItem(`procurehub_${key}`, JSON.stringify(validData))
  } catch (e) {
    console.error('LocalStorage save error:', e)
  }
}

// API Service Methods
export const apiService = {

  // Organizations
  async getOrganizations() {
    let supabaseOrgs = null
    try {
      const { data, error } = await supabase.from('organizations').select('*').order('created_at', { ascending: false })
      if (!error && data) supabaseOrgs = data
    } catch (e) {
      console.warn('Supabase query failed, falling back to local dataset:', e)
    }

    const localOrgs = getLocalData('organizations', INITIAL_ORGANIZATIONS)

    // If Supabase returned data, Supabase is the single source of truth for active records!
    if (supabaseOrgs !== null) {
      const localMap = new Map()
      localOrgs.forEach(l => {
        if (l && l.id) localMap.set(String(l.id), l)
        if (l && l.email) localMap.set(String(l.email), l)
      })

      const merged = supabaseOrgs.map(s => {
        const localOverride = localMap.get(String(s.id)) || localMap.get(String(s.email))
        if (localOverride) {
          return { ...localOverride, ...s }
        }
        return s
      })

      return merged
        .filter(o => o && o.name && String(o.name).trim() !== '')
        .map(o => ({
          ...o,
          spend: (o.status === 'Pending' || o.status === 'Rejected') ? 0.00 : (o.spend || 0)
        }))
    }

    return localOrgs
      .filter(o => o && o.name && String(o.name).trim() !== '')
      .map(o => ({
        ...o,
        spend: (o.status === 'Pending' || o.status === 'Rejected') ? 0.00 : (o.spend || 0)
      }))
  },

  async updateOrgStatus(id, status, rejection_reason = null) {
    const updatePayload = { status }
    if (rejection_reason !== null && rejection_reason !== undefined) {
      updatePayload.rejection_reason = rejection_reason
    } else {
      updatePayload.rejection_reason = null
    }

    let targetEmail = String(id).includes('@') ? id : null
    let targetId = id

    try {
      const { data: supabaseOrgs } = await supabase.from('organizations').select('id, email')
      if (supabaseOrgs && supabaseOrgs.length > 0) {
        const found = supabaseOrgs.find(o => String(o.id) === String(id) || (o.email && String(o.email).toLowerCase() === String(id).toLowerCase()))
        if (found) {
          if (found.id) targetId = found.id
          if (found.email) targetEmail = found.email
        }
      }
    } catch (e) {}

    try {
      let updatedInSupabase = false

      if (targetId) {
        const resId = await supabase.from('organizations').update(updatePayload).eq('id', targetId).select()
        if (!resId.error && resId.data && resId.data.length > 0) {
          updatedInSupabase = true
        }
      }

      if (!updatedInSupabase && targetEmail && targetEmail.includes('@')) {
        const resEmail = await supabase.from('organizations').update(updatePayload).eq('email', targetEmail).select()
        if (!resEmail.error && resEmail.data && resEmail.data.length > 0) {
          updatedInSupabase = true
        }
      }
    } catch (e) {
      console.warn('Supabase org update fallback:', e)
    }

    const localOrgs = getLocalData('organizations', INITIAL_ORGANIZATIONS)
    const updated = localOrgs.map(org => {
      if (String(org.id) === String(id) || (org.email && String(org.email) === String(id)) || (targetEmail && org.email === targetEmail)) {
        return {
          ...org,
          status,
          rejection_reason: (status === 'Approved' || status === 'Active') ? null : rejection_reason,
          spend: (status === 'Approved' || status === 'Active') ? (org.spend || 0.00) : 0.00
        }
      }
      return org
    }).filter(org => org && org.name && String(org.name).trim() !== '')

    setLocalData('organizations', updated)
    this.addActivity({
      title: (status === 'Approved' || status === 'Active') ? 'Organization Activated' : 'Organization Deactivated',
      description: `Organization status changed to ${status}${rejection_reason ? `: ${rejection_reason}` : ''}`,
      type: (status === 'Approved' || status === 'Active') ? 'approval' : 'rejection'
    })
    return this.getOrganizations()
  },

  async createOrganization(data) {
    const newOrg = {
      id: `org-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      contact_person: data.contact_person || '',
      industry: data.industry || 'Information Technology',
      gstin: data.gstin || '',
      address: data.address || '',
      status: data.status || 'Active',
      created_at: new Date().toISOString(),
      rejection_reason: null,
      spend: 0.00,
      password: data.password || '123456'
    }

    try {
      const { error } = await supabase.from('organizations').insert([{
        id: newOrg.id,
        name: newOrg.name,
        email: newOrg.email,
        phone: newOrg.phone,
        industry: newOrg.industry,
        gstin: newOrg.gstin,
        address: newOrg.address,
        status: newOrg.status,
        created_at: newOrg.created_at
      }])
      if (error) console.warn('Supabase org insert error:', error)
    } catch (e) {
      console.warn('Supabase org insert fallback:', e)
    }

    const current = getLocalData('organizations', INITIAL_ORGANIZATIONS)
    const updated = [newOrg, ...current]
    setLocalData('organizations', updated)

    this.addActivity({
      title: 'Organization Added',
      description: `Super Admin manually created organization: ${newOrg.name}`,
      type: 'approval'
    })

    return this.getOrganizations()
  },

  // Vendors
  async getVendors() {
    let supabaseVendors = null
    try {
      const { data, error } = await supabase.from('vendors').select('*').order('created_at', { ascending: false })
      if (!error && data) supabaseVendors = data
    } catch (e) {
      console.warn('Supabase vendors query failed:', e)
    }

    const localVendors = getLocalData('vendors', INITIAL_VENDORS)

    if (supabaseVendors !== null) {
      const localMap = new Map()
      localVendors.forEach(l => {
        if (l && l.id) localMap.set(String(l.id), l)
        if (l && l.email) localMap.set(String(l.email), l)
      })

      const merged = supabaseVendors.map(s => {
        const localOverride = localMap.get(String(s.id)) || localMap.get(String(s.email))
        if (localOverride) {
          return { ...localOverride, ...s }
        }
        return s
      })

      return merged.filter(v => v && v.name && String(v.name).trim() !== '')
    }

    return localVendors.filter(v => v && v.name && String(v.name).trim() !== '')
  },

  async updateVendorStatus(id, status, rejection_reason = null) {
    const updatePayload = { status }

    let targetEmail = String(id).includes('@') ? id : null
    let targetId = id

    try {
      const { data: supabaseVendors } = await supabase.from('vendors').select('id, email')
      if (supabaseVendors && supabaseVendors.length > 0) {
        const found = supabaseVendors.find(v => String(v.id) === String(id) || (v.email && String(v.email).toLowerCase() === String(id).toLowerCase()))
        if (found) {
          if (found.id) targetId = found.id
          if (found.email) targetEmail = found.email
        }
      }
    } catch (e) {}

    try {
      let updatedInSupabase = false

      if (targetId) {
        const resId = await supabase.from('vendors').update(updatePayload).eq('id', targetId).select()
        if (!resId.error && resId.data && resId.data.length > 0) {
          updatedInSupabase = true
        }
      }

      if (!updatedInSupabase && targetEmail && targetEmail.includes('@')) {
        const resEmail = await supabase.from('vendors').update(updatePayload).eq('email', targetEmail).select()
        if (!resEmail.error && resEmail.data && resEmail.data.length > 0) {
          updatedInSupabase = true
        }
      }
    } catch (e) {
      console.warn('Supabase vendor update fallback:', e)
    }

    const localVendors = getLocalData('vendors', INITIAL_VENDORS)
    const updated = localVendors.map(vendor => {
      if (String(vendor.id) === String(id) || (vendor.email && String(vendor.email) === String(id)) || (targetEmail && vendor.email === targetEmail)) {
        return {
          ...vendor,
          status,
          rejection_reason: (status === 'Approved' || status === 'Active') ? null : rejection_reason
        }
      }
      return vendor
    }).filter(v => v && v.name && String(v.name).trim() !== '')

    setLocalData('vendors', updated)
    this.addActivity({
      title: (status === 'Approved' || status === 'Active') ? 'Vendor Activated' : 'Vendor Deactivated',
      description: `Supplier status set to ${status}${rejection_reason ? `: ${rejection_reason}` : ''}`,
      type: (status === 'Approved' || status === 'Active') ? 'approval' : 'rejection'
    })
    return this.getVendors()
  },

  async createVendor(data) {
    const newVendor = {
      id: `ven-${Date.now()}`,
      name: data.name,
      contact_person: data.contact_person || '',
      email: data.email,
      phone: data.phone || '',
      category: data.category || 'IT Infrastructure & Hardware',
      gstin: data.gstin || '',
      pan: data.pan || '',
      address: data.address || '',
      status: data.status || 'Active',
      created_at: new Date().toISOString(),
      rejection_reason: null,
      rating: 100,
      products_count: 0,
      password: data.password || '123456'
    }

    try {
      await supabase.from('vendors').insert([{
        id: newVendor.id,
        name: newVendor.name,
        contact_person: newVendor.contact_person,
        email: newVendor.email,
        phone: newVendor.phone,
        category: newVendor.category,
        gstin: newVendor.gstin,
        pan: newVendor.pan,
        address: newVendor.address,
        status: newVendor.status,
        created_at: newVendor.created_at,
        password: newVendor.password
      }])
    } catch (e) {
      console.warn('Supabase vendor insert fallback:', e)
    }

    const current = getLocalData('vendors', INITIAL_VENDORS)
    const updated = [newVendor, ...current]
    setLocalData('vendors', updated)

    this.addActivity({
      title: 'Vendor Added',
      description: `Super Admin manually created supplier: ${newVendor.name}`,
      type: 'approval'
    })

    return this.getVendors()
  },

  normalizeProduct(p) {
    if (!p) return p
    const rawPrice = p.price ?? p.unit_price ?? p.unitPrice ?? p.price_per_unit ?? p.cost ?? p.rate ?? p.amount ?? 0
    const rawStock = p.stock ?? p.stock_quantity ?? p.quantity ?? p.stock_qty ?? p.qty ?? p.inventory ?? 0
    const priceNum = typeof rawPrice === 'string' ? parseFloat(rawPrice.replace(/[^0-9.-]+/g, '')) || 0 : Number(rawPrice) || 0
    const stockNum = typeof rawStock === 'string' ? parseInt(rawStock, 10) || 0 : Number(rawStock) || 0

    return {
      ...p,
      id: p.id || p.product_id || `prod-${Math.random()}`,
      name: p.name || p.title || p.product_name || 'Unnamed Product',
      sku: p.sku || p.sku_code || p.code || p.product_code || 'N/A',
      category: p.category || p.category_name || 'General',
      price: priceNum,
      unit_price: priceNum,
      stock: stockNum,
      stock_quantity: stockNum,
      vendor_name: p.vendor_name || p.vendorName || p.supplier_name || p.vendor || 'Vendor Partner',
      vendor_id: p.vendor_id || p.vendorId || p.supplier_id || '',
      status: p.status || 'Active',
      description: p.description || p.desc || '',
      image: p.image || p.image_url || p.img_url || p.photo_url || p.photo || p.url || ''
    }
  },

  // Products
  async getProducts() {
    try {
      const { data, error } = await supabase.from('products').select('*')
      if (!error && data && data.length > 0) {
        return data.map(p => this.normalizeProduct(p))
      }
    } catch (e) {
      console.warn('Supabase products fallback:', e)
    }
    const local = getLocalData('products', INITIAL_PRODUCTS)
    return local.map(p => this.normalizeProduct(p))
  },

  // Purchase Orders
  async getOrders() {
    try {
      const { data, error } = await supabase.from('purchase_orders').select('*').order('date', { ascending: false })
      if (!error && data && data.length > 0) return data
    } catch (e) {
      console.warn('Supabase orders fallback:', e)
    }
    return getLocalData('orders', INITIAL_ORDERS)
  },

  // Activity Logs
  async getActivities() {
    try {
      const { data, error } = await supabase.from('activities').select('*').order('created_at', { ascending: false })
      if (!error && data && data.length > 0) return data
    } catch (e) {
      console.warn('Supabase activities query fallback:', e)
    }
    const local = getLocalData('activities', INITIAL_ACTIVITIES) || []
    const isMock = (a) => {
      if (!a) return true
      if (['act-1', 'act-2', 'act-3', 'act-4'].includes(a.id)) return true
      const desc = a.description || ''
      if (desc.includes('OmniSys Hardware Systems submitted') ||
          desc.includes('Apex Global Technologies Ltd registered') ||
          desc.includes('disbursed to ProOffice Supplies') ||
          desc.includes('Metropolis Infra Corp was approved')) {
        return true
      }
      return false
    }
    const cleaned = local.filter(a => !isMock(a))
    if (cleaned.length !== local.length) {
      setLocalData('activities', cleaned)
    }
    return cleaned
  },

  addActivity(activity) {
    const isMock = (a) => {
      if (!a) return true
      if (['act-1', 'act-2', 'act-3', 'act-4'].includes(a.id)) return true
      const desc = a.description || ''
      if (desc.includes('OmniSys Hardware Systems submitted') ||
          desc.includes('Apex Global Technologies Ltd registered') ||
          desc.includes('disbursed to ProOffice Supplies') ||
          desc.includes('Metropolis Infra Corp was approved')) {
        return true
      }
      return false
    }
    const current = (getLocalData('activities', INITIAL_ACTIVITIES) || []).filter(a => !isMock(a))
    const newAct = { id: `act-${Date.now()}`, timestamp: 'Just now', ...activity }
    const updated = [newAct, ...current.slice(0, 19)]
    setLocalData('activities', updated)
    return updated
  },

  // Dashboard Stats
  async getDashboardStats() {
    const orgs       = await this.getOrganizations()
    const vendors    = await this.getVendors()
    const orders     = await this.getOrders()
    const activities = await this.getActivities()
    return {
      totalOrgs:          orgs.length,
      totalVendors:       vendors.length,
      totalSpend:         orders.reduce((sum, o) => sum + (o.amount || 0), 0),
      totalOrders:        orders.length,
      pendingOrgsCount:   orgs.filter(o => o.status === 'Pending').length,
      pendingVendorsCount:vendors.filter(v => v.status === 'Pending').length,
      activities
    }
  },

  // ── Get single org by id ──────────────────────────────────────────────────
  async getOrgById(id) {
    const orgs = await this.getOrganizations()
    return orgs.find(o => String(o.id) === String(id)) || null
  },

  // ── Get org-specific orders (with delivery + payment fields) ─────────────
  async getOrgOrders(orgId) {
    const allOrgs = await this.getOrganizations()
    const org     = allOrgs.find(o => String(o.id) === String(orgId))
    const orgName = org?.name ? org.name.toLowerCase().trim() : ''

    let realOrders = []

    // 1. Try querying Supabase purchase_orders or orders directly
    try {
      const { data: poData, error: poErr } = await supabase
        .from('purchase_orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (!poErr && poData && poData.length > 0) {
        realOrders = poData.filter(o => 
          String(o.buyer_id) === String(orgId) || 
          String(o.organization_id) === String(orgId) ||
          String(o.org_id) === String(orgId) ||
          (o.buyer_name && o.buyer_name.toLowerCase().trim() === orgName)
        )
      } else {
        const { data: oData, error: oErr } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })

        if (!oErr && oData && oData.length > 0) {
          realOrders = oData.filter(o => 
            String(o.buyer_id) === String(orgId) || 
            String(o.organization_id) === String(orgId) ||
            String(o.org_id) === String(orgId) ||
            (o.buyer_name && o.buyer_name.toLowerCase().trim() === orgName)
          )
        }
      }
    } catch (e) {
      console.warn('Supabase org orders query error:', e)
    }

    // 2. Fallback to getOrders() dataset if Supabase didn't yield matches
    if (realOrders.length === 0) {
      const allOrders = await this.getOrders()
      realOrders = allOrders.filter(o => 
        String(o.buyer_id) === String(orgId) || 
        String(o.organization_id) === String(orgId) ||
        String(o.org_id) === String(orgId) ||
        (o.buyer_name && o.buyer_name.toLowerCase().trim() === orgName)
      )
    }

    // 3. Enrich real order fields for UI display
    const deliveryStatuses = ['Delivered', 'In Transit', 'Processing', 'Out for Delivery', 'Pending Pickup']
    const enriched = realOrders.map((o, idx) => {
      const amt     = Number(o.amount || o.total_amount || o.total_price || o.total || 0)
      const status  = o.status || 'Pending'
      const isPaid  = status === 'Disbursed' || status === 'Paid' || status === 'Fulfilled' || status === 'Completed'
      const isPart  = status === 'Partial'

      const paidAmt    = Number(o.paid_amount !== undefined ? o.paid_amount : isPaid ? amt : isPart ? Math.round(amt * 0.5) : 0)
      const pendingAmt = Number(o.pending_amount !== undefined ? o.pending_amount : amt - paidAmt)

      const dStatus = o.delivery_status || o.shipping_status || (isPaid ? 'Delivered' : status === 'Approved' ? 'In Transit' : 'Processing')
      const pStatus = o.payment_status || (isPaid ? 'Paid' : isPart ? 'Partial' : 'Pending')

      const rawDate = o.date || o.created_at || new Date().toISOString().slice(0, 10)
      const dateStr = String(rawDate).slice(0, 10)

      return {
        id:              o.id || `po-real-${idx + 1}`,
        po_number:       o.po_number || o.order_number || o.code || `PO-2026-${100 + idx}`,
        vendor_name:     o.vendor_name || o.supplier_name || 'Vendor Partner',
        amount:          amt,
        paid_amount:     paidAmt,
        pending_amount:  pendingAmt,
        status:          status,
        delivery_status: dStatus,
        payment_status:  pStatus,
        payment_ref:     o.payment_ref || o.transaction_ref || (isPaid ? `PAY-TXN-${1000 + idx}` : '—'),
        date:            dateStr,
        month:           dateStr.slice(0, 7),
        items_count:     Number(o.items_count || o.total_items || (o.items ? o.items.length : 1)),
      }
    })

    enriched.sort((a, b) => new Date(b.date) - new Date(a.date))
    return enriched
  },

  // ── Get single vendor by id ───────────────────────────────────────────────
  async getVendorById(id) {
    const vendors = await this.getVendors()
    return vendors.find(v => String(v.id) === String(id)) || null
  },

  // ── Get products for a specific vendor ───────────────────────────────────
  async getVendorProducts(vendorId) {
    const vendors = await this.getVendors()
    const vendor  = vendors.find(v => String(v.id) === String(vendorId))
    const vName   = vendor?.name ? vendor.name.toLowerCase().trim() : ''

    let realProds = []

    try {
      const { data, error } = await supabase.from('products').select('*')
      if (!error && data && data.length > 0) {
        realProds = data.filter(p => 
          String(p.vendor_id || p.vendorId || p.supplier_id) === String(vendorId) ||
          (p.vendor_name && p.vendor_name.toLowerCase().trim() === vName) ||
          (p.vendorName && p.vendorName.toLowerCase().trim() === vName) ||
          (p.supplier_name && p.supplier_name.toLowerCase().trim() === vName)
        )
      }
    } catch (e) {
      console.warn('Supabase vendor products query error:', e)
    }

    if (realProds.length === 0) {
      const allProducts = await this.getProducts()
      realProds = allProducts.filter(p => 
        String(p.vendor_id || p.vendorId || p.supplier_id) === String(vendorId) ||
        (p.vendor_name && p.vendor_name.toLowerCase().trim() === vName)
      )
    }

    return realProds.map(p => this.normalizeProduct(p))
  },

  // ── Get orders for a specific vendor ─────────────────────────────────────
  async getVendorOrders(vendorId) {
    const vendors = await this.getVendors()
    const vendor  = vendors.find(v => String(v.id) === String(vendorId))
    const vName   = vendor?.name ? vendor.name.toLowerCase().trim() : ''

    let realOrders = []

    try {
      const { data: poData, error: poErr } = await supabase
        .from('purchase_orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (!poErr && poData && poData.length > 0) {
        realOrders = poData.filter(o => 
          String(o.vendor_id) === String(vendorId) || 
          (o.vendor_name && o.vendor_name.toLowerCase().trim() === vName)
        )
      } else {
        const { data: oData, error: oErr } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })

        if (!oErr && oData && oData.length > 0) {
          realOrders = oData.filter(o => 
            String(o.vendor_id) === String(vendorId) || 
            (o.vendor_name && o.vendor_name.toLowerCase().trim() === vName)
          )
        }
      }
    } catch (e) {
      console.warn('Supabase vendor orders query error:', e)
    }

    if (realOrders.length === 0) {
      const allOrders = await this.getOrders()
      realOrders = allOrders.filter(o => 
        String(o.vendor_id) === String(vendorId) || 
        (o.vendor_name && o.vendor_name.toLowerCase().trim() === vName)
      )
    }

    const deliveryStatuses = ['Delivered', 'In Transit', 'Processing', 'Out for Delivery', 'Pending Pickup']
    const enriched = realOrders.map((o, idx) => {
      const amt     = Number(o.amount || o.total_amount || o.total_price || o.total || 0)
      const status  = o.status || 'Pending'
      const isPaid  = status === 'Disbursed' || status === 'Paid' || status === 'Fulfilled' || status === 'Completed'
      const isPart  = status === 'Partial'

      const paidAmt    = Number(o.paid_amount !== undefined ? o.paid_amount : isPaid ? amt : isPart ? Math.round(amt * 0.5) : 0)
      const pendingAmt = Number(o.pending_amount !== undefined ? o.pending_amount : amt - paidAmt)

      const dStatus = o.delivery_status || o.shipping_status || (isPaid ? 'Delivered' : status === 'Approved' ? 'In Transit' : 'Processing')
      const pStatus = o.payment_status || (isPaid ? 'Paid' : isPart ? 'Partial' : 'Pending')

      const rawDate = o.date || o.created_at || new Date().toISOString().slice(0, 10)
      const dateStr = String(rawDate).slice(0, 10)

      return {
        id:              o.id || `po-vendor-${idx + 1}`,
        po_number:       o.po_number || o.order_number || o.code || `PO-2026-${100 + idx}`,
        buyer_name:      o.buyer_name || o.organization_name || 'Buyer Enterprise',
        amount:          amt,
        paid_amount:     paidAmt,
        pending_amount:  pendingAmt,
        status:          status,
        delivery_status: dStatus,
        payment_status:  pStatus,
        payment_ref:     o.payment_ref || o.transaction_ref || (isPaid ? `PAY-TXN-${1000 + idx}` : '—'),
        date:            dateStr,
        month:           dateStr.slice(0, 7),
        items_count:     Number(o.items_count || o.total_items || (o.items ? o.items.length : 1)),
      }
    })

    enriched.sort((a, b) => new Date(b.date) - new Date(a.date))
    return enriched
  }
}

