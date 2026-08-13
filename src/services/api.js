import { supabase } from '../lib/supabase'

// Fallback Initial Datasets for seamless fallback & demo
const INITIAL_ORGANIZATIONS = [
  {
    id: 'org-101',
    name: 'Apex Global Technologies Ltd',
    email: 'procurement@apexglobal.com',
    phone: '+91 98765 43210',
    industry: 'Information Technology',
    gstin: '27AAACA1234A1Z5',
    address: 'Tech Park, Tower B, Cyber City, Gurugram, HR - 122002',
    status: 'Pending',
    created_at: '2026-08-11T10:30:00Z',
    rejection_reason: null,
    spend: 145200.00
  },
  {
    id: 'org-102',
    name: 'BioHealth Pharma Solutions',
    email: 'admin@biohealth.co.in',
    phone: '+91 91234 56789',
    industry: 'Healthcare & Pharma',
    gstin: '29AABCB5678B2Z9',
    address: 'Plot 45, Electronic City Phase 1, Bengaluru, KA - 560100',
    status: 'Pending',
    created_at: '2026-08-12T08:15:00Z',
    rejection_reason: null,
    spend: 89300.00
  },
  {
    id: 'org-103',
    name: 'Metropolis Infra Corp',
    email: 'contact@metropolisinfra.org',
    phone: '+91 99887 76655',
    industry: 'Construction & Infrastructure',
    gstin: '07AAACM9988C1Z3',
    address: 'Barakhamba Road, Connaught Place, New Delhi - 110001',
    status: 'Approved',
    created_at: '2026-08-01T14:20:00Z',
    rejection_reason: null,
    spend: 420500.00
  },
  {
    id: 'org-104',
    name: 'Zenith Logistics & Supply',
    email: 'ops@zenithlogistics.in',
    phone: '+91 97654 32109',
    industry: 'Logistics & Transport',
    gstin: '27AABCZ1234F1Z8',
    address: 'JNPT Port Area, Navi Mumbai, MH - 400707',
    status: 'Approved',
    created_at: '2026-07-28T11:00:00Z',
    rejection_reason: null,
    spend: 215000.00
  },
  {
    id: 'org-105',
    name: 'Vanguard Retail Enterprises',
    email: 'vendorrel@vanguardretail.com',
    phone: '+91 93456 78901',
    industry: 'FMCG & Retail',
    gstin: '33AAACV8877D1Z2',
    address: 'Anna Salai, T Nagar, Chennai, TN - 600017',
    status: 'Rejected',
    created_at: '2026-08-05T16:45:00Z',
    rejection_reason: 'Incomplete business license and invalid GSTIN verification documents.',
    spend: 0.00
  }
]

const INITIAL_VENDORS = [
  {
    id: 'ven-201',
    name: 'OmniSys Hardware Systems',
    contact_person: 'Rajesh Sharma',
    email: 'sales@omnisys.co.in',
    phone: '+91 98111 22334',
    category: 'IT Infrastructure & Hardware',
    gstin: '27AAACF5544E1Z6',
    pan: 'AAACF5544E',
    address: 'Sakinaka, Andheri East, Mumbai, MH - 400072',
    status: 'Approved',
    created_at: '2026-07-20T09:00:00Z',
    rejection_reason: null,
    rating: 94,
    products_count: 48
  },
  {
    id: 'ven-202',
    name: 'ChemClean Industrial Chemicals',
    contact_person: 'Priya Nair',
    email: 'supply@chemclean.in',
    phone: '+91 97899 34512',
    category: 'Industrial Chemicals & Safety',
    gstin: '29AABCC7788G2Z4',
    pan: 'AABCC7788G',
    address: 'MIDC Industrial Area, Pune, MH - 411019',
    status: 'Pending',
    created_at: '2026-08-10T13:30:00Z',
    rejection_reason: null,
    rating: 88,
    products_count: 62
  },
  {
    id: 'ven-203',
    name: 'ProOffice Supplies Pvt Ltd',
    contact_person: 'Anil Desai',
    email: 'orders@prooffice.co.in',
    phone: '+91 96543 21098',
    category: 'Office Equipment & Furniture',
    gstin: '27AAACH3322J1Z9',
    pan: 'AAACH3322J',
    address: 'Santacruz West, Mumbai, MH - 400054',
    status: 'Approved',
    created_at: '2026-07-15T10:00:00Z',
    rejection_reason: null,
    rating: 91,
    products_count: 134
  },
  {
    id: 'ven-204',
    name: 'CyberShield Security Solutions',
    contact_person: 'Sanjay Mehta',
    email: 'enterprise@cybershield.io',
    phone: '+91 91122 33445',
    category: 'IT Security & Cybersecurity',
    gstin: '07AAACS4456K1Z1',
    pan: 'AAACS4456K',
    address: 'Nehru Place IT Hub, New Delhi - 110019',
    status: 'Pending',
    created_at: '2026-08-08T16:00:00Z',
    rejection_reason: null,
    rating: 97,
    products_count: 21
  },
  {
    id: 'ven-205',
    name: 'GreenPower Energy Solutions',
    contact_person: 'Kavitha Reddy',
    email: 'b2b@greenpower.energy',
    phone: '+91 98876 54321',
    category: 'Renewable Energy & Infrastructure',
    gstin: '36AAACG6677L2Z7',
    pan: 'AAACG6677L',
    address: 'Hitech City, Hyderabad, TS - 500081',
    status: 'Rejected',
    created_at: '2026-08-03T11:15:00Z',
    rejection_reason: 'PAN card verification failed; registered address does not match MCA records.',
    rating: 76,
    products_count: 9
  }
]

const INITIAL_PRODUCTS = [
  {
    id: 'prod-301',
    name: 'Enterprise Rack Server - Dell PowerEdge R750',
    sku: 'HW-SRV-001',
    category: 'IT Infrastructure & Hardware',
    price: 285000.00,
    vendor_name: 'OmniSys Hardware Systems',
    vendor_id: 'ven-201',
    stock: 8,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80'
  },
  {
    id: 'prod-302',
    name: 'Sodium Hypochlorite Industrial Grade 20L',
    sku: 'CHEM-SOD-101',
    category: 'Industrial Chemicals & Safety',
    price: 1250.00,
    vendor_name: 'ChemClean Industrial Chemicals',
    vendor_id: 'ven-202',
    stock: 500,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&q=80'
  },
  {
    id: 'prod-303',
    name: 'Ergonomic Executive Chair Pro Series',
    sku: 'FUR-CH-201',
    category: 'Office Equipment & Furniture',
    price: 18500.00,
    vendor_name: 'ProOffice Supplies Pvt Ltd',
    vendor_id: 'ven-203',
    stock: 60,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&q=80'
  },
  {
    id: 'prod-304',
    name: 'Next-Gen EDR Enterprise License (500 seats)',
    sku: 'SEC-EDR-301',
    category: 'IT Security & Cybersecurity',
    price: 420000.00,
    vendor_name: 'CyberShield Security Solutions',
    vendor_id: 'ven-204',
    stock: 999,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=80'
  },
  {
    id: 'prod-305',
    name: '4K UltraHD Video Conference Bar',
    sku: 'HW-VC-400',
    category: 'IT Infrastructure & Hardware',
    price: 85000.00,
    vendor_name: 'OmniSys Hardware Systems',
    vendor_id: 'ven-201',
    stock: 15,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&q=80'
  },
  {
    id: 'prod-306',
    name: 'Standing Electric Height Adjustable Desk',
    sku: 'FUR-DSK-301',
    category: 'Office Equipment & Furniture',
    price: 32000.00,
    vendor_name: 'ProOffice Supplies Pvt Ltd',
    vendor_id: 'ven-203',
    stock: 45,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&q=80'
  }
]

const INITIAL_ORDERS = [
  {
    id: 'po-401',
    po_number: 'PO-2026-8891',
    buyer_name: 'Metropolis Infra Corp',
    vendor_name: 'ProOffice Supplies Pvt Ltd',
    amount: 192000.00,
    status: 'Disbursed',
    date: '2026-08-10',
    items_count: 12,
    payment_ref: 'PAY-TXN-99882'
  },
  {
    id: 'po-402',
    po_number: 'PO-2026-8892',
    buyer_name: 'Apex Global Technologies Ltd',
    vendor_name: 'OmniSys Hardware Systems',
    amount: 345000.00,
    status: 'Approved',
    date: '2026-08-11',
    items_count: 2,
    payment_ref: 'PAY-TXN-99883'
  },
  {
    id: 'po-403',
    po_number: 'PO-2026-8893',
    buyer_name: 'BioHealth Pharma Solutions',
    vendor_name: 'ChemClean Industrial Chemicals',
    amount: 64990.00,
    status: 'Fulfilled',
    date: '2026-08-09',
    items_count: 10,
    payment_ref: 'PAY-TXN-99884'
  },
  {
    id: 'po-404',
    po_number: 'PO-2026-8894',
    buyer_name: 'Zenith Logistics & Supply',
    vendor_name: 'CyberShield Security Solutions',
    amount: 120000.00,
    status: 'Pending',
    date: '2026-08-12',
    items_count: 1,
    payment_ref: 'PENDING-APPROVAL'
  },
  {
    id: 'po-405',
    po_number: 'PO-2026-8895',
    buyer_name: 'Metropolis Infra Corp',
    vendor_name: 'OmniSys Hardware Systems',
    amount: 255000.00,
    status: 'Disbursed',
    date: '2026-08-05',
    items_count: 3,
    payment_ref: 'PAY-TXN-99870'
  }
]

const INITIAL_ACTIVITIES = []

// Local state helpers
const getLocalData = (key, initial) => {
  try {
    const saved = localStorage.getItem(`procurehub_${key}`)
    return saved ? JSON.parse(saved) : initial
  } catch (e) {
    return initial
  }
}

const setLocalData = (key, data) => {
  try {
    localStorage.setItem(`procurehub_${key}`, JSON.stringify(data))
  } catch (e) {
    console.error('LocalStorage save error:', e)
  }
}

// API Service Methods
export const apiService = {

  // Organizations
  async getOrganizations() {
    try {
      const { data, error } = await supabase.from('organizations').select('*').order('created_at', { ascending: false })
      if (!error && data && data.length > 0) return data
    } catch (e) {
      console.warn('Supabase query failed, falling back to local dataset:', e)
    }
    return getLocalData('organizations', INITIAL_ORGANIZATIONS)
  },

  async updateOrgStatus(id, status, rejection_reason = null) {
    try {
      const updatePayload = { status, updated_at: new Date().toISOString() }
      if (rejection_reason !== undefined) updatePayload.rejection_reason = rejection_reason
      await supabase.from('organizations').update(updatePayload).eq('id', id)
    } catch (e) {
      console.warn('Supabase org update fallback:', e)
    }
    const currentOrgs = getLocalData('organizations', INITIAL_ORGANIZATIONS)
    const updated = currentOrgs.map(org =>
      org.id === id
        ? { ...org, status, rejection_reason: status === 'Approved' ? null : rejection_reason }
        : org
    )
    setLocalData('organizations', updated)
    this.addActivity({
      title: status === 'Approved' ? 'Organization Approved' : 'Organization Rejected',
      description: `Organization #${id} status changed to ${status}${rejection_reason ? `: ${rejection_reason}` : ''}`,
      type: status === 'Approved' ? 'approval' : 'rejection'
    })
    return updated
  },

  async createOrganization(data) {
    const newOrg = {
      id: `org-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      industry: data.industry || 'Information Technology',
      gstin: data.gstin || '',
      address: data.address || '',
      status: data.status || 'Approved',
      created_at: new Date().toISOString(),
      rejection_reason: null,
      spend: 0.00,
      password: data.password || '123456'
    }

    try {
      await supabase.from('organizations').insert([{
        id: newOrg.id,
        name: newOrg.name,
        email: newOrg.email,
        phone: newOrg.phone,
        industry: newOrg.industry,
        gstin: newOrg.gstin,
        address: newOrg.address,
        status: newOrg.status,
        created_at: newOrg.created_at,
        password: newOrg.password
      }])
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

    return updated
  },

  // Vendors
  async getVendors() {
    try {
      const { data, error } = await supabase.from('vendors').select('*').order('created_at', { ascending: false })
      if (!error && data && data.length > 0) return data
    } catch (e) {
      console.warn('Supabase vendors query failed:', e)
    }
    return getLocalData('vendors', INITIAL_VENDORS)
  },

  async updateVendorStatus(id, status, rejection_reason = null) {
    try {
      const updatePayload = { status, updated_at: new Date().toISOString() }
      if (rejection_reason !== undefined) updatePayload.rejection_reason = rejection_reason
      await supabase.from('vendors').update(updatePayload).eq('id', id)
    } catch (e) {
      console.warn('Supabase vendor update fallback:', e)
    }
    const currentVendors = getLocalData('vendors', INITIAL_VENDORS)
    const updated = currentVendors.map(vendor =>
      vendor.id === id
        ? { ...vendor, status, rejection_reason: status === 'Approved' ? null : rejection_reason }
        : vendor
    )
    setLocalData('vendors', updated)
    this.addActivity({
      title: status === 'Approved' ? 'Vendor Approved' : 'Vendor Rejected',
      description: `Supplier #${id} status set to ${status}${rejection_reason ? `: ${rejection_reason}` : ''}`,
      type: status === 'Approved' ? 'approval' : 'rejection'
    })
    return updated
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
      status: data.status || 'Approved',
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

    return updated
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

