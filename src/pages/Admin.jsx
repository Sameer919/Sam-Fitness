import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiShieldUserLine, RiDashboard3Line, RiMailSendLine, RiUserAddLine,
  RiLogoutBoxRLine, RiAlertLine, RiLoader4Line, RiContactsBookLine
} from 'react-icons/ri'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Admin() {
  const [token] = useState(() => {
    return localStorage.getItem('adminToken') || null
  })
  const [activeTab, setActiveTab] = useState('stats') // stats | contacts | memberships | newsletter
  const [stats, setStats] = useState(null)
  const [contacts, setContacts] = useState([])
  const [memberships, setMemberships] = useState([])
  const [newsletter, setNewsletter] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [expandedRow, setExpandedRow] = useState(null)
  
  const navigate = useNavigate()

  const handleLogout = useCallback(() => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    window.dispatchEvent(new Event('authChange'))
    navigate('/login')
  }, [navigate])

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])

  // Fetch data depending on activeTab
  const fetchData = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setErrorMsg('')
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }

      if (activeTab === 'stats') {
        const res = await fetch(`${BASE}/api/admin/stats`, { headers })
        const json = await res.json()
        if (!res.ok) throw new Error(json.message || 'Failed to fetch stats')
        setStats(json.data)
      } else if (activeTab === 'contacts') {
        const res = await fetch(`${BASE}/api/admin/contacts?limit=50`, { headers })
        const json = await res.json()
        if (!res.ok) throw new Error(json.message || 'Failed to fetch contact enquiries')
        setContacts(json.data)
      } else if (activeTab === 'memberships') {
        const res = await fetch(`${BASE}/api/admin/memberships?limit=50`, { headers })
        const json = await res.json()
        if (!res.ok) throw new Error(json.message || 'Failed to fetch membership leads')
        setMemberships(json.data)
      } else if (activeTab === 'newsletter') {
        const res = await fetch(`${BASE}/api/admin/newsletter?limit=100`, { headers })
        const json = await res.json()
        if (!res.ok) throw new Error(json.message || 'Failed to fetch subscribers')
        setNewsletter(json.data)
      }
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || 'An error occurred while fetching dashboard data.')
      // If token expired, clear session and send to login
      if (err.status === 401) {
        handleLogout()
      }
    } finally {
      setLoading(false)
    }
  }, [token, activeTab, handleLogout])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData()
  }, [fetchData])

  const handleUpdateContactStatus = async (id, newStatus) => {
    setActionLoading(true)
    try {
      const res = await fetch(`${BASE}/api/admin/contacts/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) throw new Error('Failed to update contact status')
      
      // Update local state
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c))
    } catch (err) {
      alert(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateMembershipStatus = async (id, newStatus) => {
    setActionLoading(true)
    try {
      const res = await fetch(`${BASE}/api/admin/memberships/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) throw new Error('Failed to update membership status')
      
      // Update local state
      setMemberships(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m))
    } catch (err) {
      alert(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="container-custom">
        {/* Title / Action bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center text-2xl shadow-sm">
              <RiShieldUserLine className="text-secondary-400" />
            </div>
            <div>
              <h1 className="font-display font-black text-2xl text-slate-900">Admin Control Panel</h1>
              <p className="text-slate-500 text-xs">Manage system leads, stats, and configurations</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-all w-fit"
          >
            <RiLogoutBoxRLine /> Sign Out Console
          </button>
        </div>

        {/* Outer card layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="space-y-2">
            {[
              { id: 'stats', label: 'Console Home', icon: RiDashboard3Line },
              { id: 'contacts', label: 'General Enquiries', icon: RiContactsBookLine },
              { id: 'memberships', label: 'Membership Leads', icon: RiUserAddLine },
              { id: 'newsletter', label: 'Subscribers', icon: RiMailSendLine },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="text-lg" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Core Panel Content */}
          <div className="lg:col-span-3">
            {errorMsg && (
              <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-100 text-rose-700 text-sm rounded-2xl mb-6">
                <RiAlertLine className="text-lg shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {loading ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center flex flex-col items-center justify-center gap-3 shadow-sm">
                  <RiLoader4Line className="animate-spin text-4xl text-primary-500" />
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Syncing Database…</p>
                </div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm overflow-hidden"
                >
                  {/* Console Home (Stats) */}
                  {activeTab === 'stats' && stats && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="font-display font-black text-lg text-slate-900">System Metrics</h2>
                        <p className="text-slate-500 text-xs">Total live database interactions summary</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Total Contacts</p>
                          <div className="flex items-baseline gap-2">
                            <span className="font-display font-black text-4xl text-slate-900">{stats.contacts.total}</span>
                            <span className="text-emerald-600 text-xs font-bold">({stats.contacts.new} new)</span>
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Membership Enquiries</p>
                          <div className="flex items-baseline gap-2">
                            <span className="font-display font-black text-4xl text-slate-900">{stats.memberships.total}</span>
                            <span className="text-indigo-600 text-xs font-bold">({stats.memberships.new} new)</span>
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Newsletter Readers</p>
                          <div className="flex items-baseline gap-2">
                            <span className="font-display font-black text-4xl text-slate-900">{stats.newsletter.total}</span>
                            <span className="text-slate-500 text-xs">({stats.newsletter.active} active)</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Admin Actions / Instruction card */}
                      <div className="p-5 bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-2xl relative overflow-hidden">
                        <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
                        <h3 className="font-display font-black text-base mb-2">Active Admin Directives</h3>
                        <p className="text-xs text-white/85 leading-relaxed max-w-xl">
                          Use the tabs on the left side to review contact details, update client follow-up indicators, and copy mailing address exports for CRM uploads.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* General Enquiries List */}
                  {activeTab === 'contacts' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="font-display font-black text-lg text-slate-900">General Enquiries</h2>
                        <p className="text-slate-500 text-xs">Review client messages and follow-up states</p>
                      </div>

                      {contacts.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl text-slate-400 text-xs font-medium">
                          No contact forms submitted yet.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                                <th className="pb-3 font-semibold">Client</th>
                                <th className="pb-3 font-semibold">Subject</th>
                                <th className="pb-3 font-semibold">Submitted</th>
                                <th className="pb-3 font-semibold">Status</th>
                                <th className="pb-3 font-semibold text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {contacts.map((c) => (
                                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                  <td className="py-4">
                                    <p className="font-bold text-slate-800">{c.first_name} {c.last_name}</p>
                                    <p className="text-slate-400">{c.email} · {c.phone || 'No Phone'}</p>
                                  </td>
                                  <td className="py-4 text-slate-600 font-medium">{c.subject}</td>
                                  <td className="py-4 text-slate-500">{new Date(c.created_at).toLocaleDateString()}</td>
                                  <td className="py-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      c.status === 'new' ? 'bg-indigo-50 text-indigo-700' :
                                      c.status === 'read' ? 'bg-slate-100 text-slate-600' :
                                      'bg-green-50 text-green-700'
                                    }`}>
                                      {c.status}
                                    </span>
                                  </td>
                                  <td className="py-4 text-right space-y-1">
                                    <button
                                      onClick={() => setExpandedRow(expandedRow === c.id ? null : c.id)}
                                      className="text-primary-600 hover:text-primary-800 font-bold mr-3"
                                    >
                                      {expandedRow === c.id ? 'Hide Details' : 'View Message'}
                                    </button>
                                    <select
                                      value={c.status}
                                      disabled={actionLoading}
                                      onChange={(e) => handleUpdateContactStatus(c.id, e.target.value)}
                                      className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[11px] outline-none"
                                    >
                                      <option value="new">New</option>
                                      <option value="read">Read</option>
                                      <option value="replied">Replied</option>
                                    </select>
                                    {expandedRow === c.id && (
                                      <div className="col-span-full text-left bg-slate-50 border border-slate-100 p-4 rounded-xl mt-2 text-slate-600 space-y-1 w-80 max-w-full float-right">
                                        <p className="font-bold text-slate-700">Message Body:</p>
                                        <p className="italic text-xs font-medium bg-white p-2.5 rounded border border-slate-100 leading-relaxed">"{c.message}"</p>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Membership Leads */}
                  {activeTab === 'memberships' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="font-display font-black text-lg text-slate-900">Membership Leads</h2>
                        <p className="text-slate-500 text-xs">Verify leads requested from pricing tiers</p>
                      </div>

                      {memberships.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl text-slate-400 text-xs font-medium">
                          No membership requests yet.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                                <th className="pb-3 font-semibold">Lead Details</th>
                                <th className="pb-3 font-semibold">Target Tier</th>
                                <th className="pb-3 font-semibold">Billing Frequency</th>
                                <th className="pb-3 font-semibold">Submitted</th>
                                <th className="pb-3 font-semibold">Status</th>
                                <th className="pb-3 font-semibold text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {memberships.map((m) => (
                                <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                  <td className="py-4">
                                    <p className="font-bold text-slate-800">{m.first_name} {m.last_name}</p>
                                    <p className="text-slate-400">{m.email} · {m.phone || 'No Phone'}</p>
                                  </td>
                                  <td className="py-4">
                                    <span className="font-bold uppercase text-slate-700">{m.plan}</span>
                                  </td>
                                  <td className="py-4 text-slate-500 font-medium capitalize">{m.billing}</td>
                                  <td className="py-4 text-slate-500">{new Date(m.created_at).toLocaleDateString()}</td>
                                  <td className="py-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      m.status === 'new' ? 'bg-indigo-50 text-indigo-700' :
                                      m.status === 'read' ? 'bg-slate-100 text-slate-600' :
                                      m.status === 'replied' ? 'bg-orange-50 text-orange-700' :
                                      'bg-green-50 text-green-700'
                                    }`}>
                                      {m.status}
                                    </span>
                                  </td>
                                  <td className="py-4 text-right">
                                    <select
                                      value={m.status}
                                      disabled={actionLoading}
                                      onChange={(e) => handleUpdateMembershipStatus(m.id, e.target.value)}
                                      className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[11px] outline-none"
                                    >
                                      <option value="new">New</option>
                                      <option value="read">Read</option>
                                      <option value="replied">Replied</option>
                                      <option value="converted">Converted</option>
                                    </select>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Newsletter Subscribers */}
                  {activeTab === 'newsletter' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="font-display font-black text-lg text-slate-900">Newsletter Readers</h2>
                        <p className="text-slate-500 text-xs">Verify active mailing list emails</p>
                      </div>

                      {newsletter.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl text-slate-400 text-xs font-medium">
                          No newsletter subscribers yet.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {newsletter.map((item) => (
                            <div key={item.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                              <div>
                                <p className="font-bold text-slate-800 text-sm">{item.name || 'Anonymous Reader'}</p>
                                <p className="text-slate-400 text-xs">{item.email}</p>
                              </div>
                              <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                Active
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
