'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Card, { CardContent, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { useAuth } from '../../components/AuthProvider'
import { useCart } from '../../components/CartProvider'

export default function DashboardPage() {
  const { user, loading: authLoading, signOut, isAuthenticated } = useAuth()
  const { cartCount } = useCart()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  const handleSignOut = () => {
    signOut()
    router.push('/')
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Orders', value: '12', icon: '📦' },
    { label: 'Bookings', value: '3', icon: '📅' },
    { label: 'Cart Items', value: cartCount || '0', icon: '🛒' },
    { label: 'Messages', value: '5', icon: '💬' },
  ]

  const recentOrders = [
    { id: '1', date: '2026-04-15', status: 'Delivered', total: 149.99 },
    { id: '2', date: '2026-04-10', status: 'Processing', total: 89.99 },
    { id: '3', date: '2026-04-05', status: 'Shipped', total: 299.99 },
  ]

  const getInitials = (email) => {
    if (!email) return 'U'
    return email.charAt(0).toUpperCase()
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-zinc-900/50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'}!
              </h1>
              <p className="text-zinc-400">Manage your account and activity</p>
            </div>
            <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(stat => (
              <Card key={stat.label} className="hover-lift">
                <CardContent className="text-center p-6">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Orders */}
              <Card className="hover-lift">
                <CardContent>
                  <div className="flex justify-between items-center mb-6">
                    <CardTitle>Recent Orders</CardTitle>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                  <div className="space-y-4">
                    {recentOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-zinc-500">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded text-xs ${
                            order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                            order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {order.status}
                          </span>
                          <p className="text-cyan-400 font-semibold mt-1">${order.total}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="hover-lift">
                <CardContent>
                  <CardTitle className="mb-4">Quick Actions</CardTitle>
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/shop"><Button variant="outline" className="w-full">🛒 Shop Now</Button></Link>
                    <Link href="/travel"><Button variant="outline" className="w-full">✈️ Book Travel</Button></Link>
                    <Link href="/contact"><Button variant="outline" className="w-full">💬 Send Message</Button></Link>
                    <Link href="/portfolio"><Button variant="outline" className="w-full">💼 View Portfolio</Button></Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <Card className="hover-lift">
                <CardContent>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full mx-auto flex items-center justify-center text-2xl font-bold mb-4">
                      {getInitials(user?.email)}
                    </div>
                    <h3 className="font-semibold text-lg">{user?.name || 'User'}</h3>
                    <p className="text-sm text-zinc-500">{user?.email}</p>
                    <div className="mt-4">
                      <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded-full">
                        {user?.role || 'Member'}
                      </span>
                    </div>
                    <Button className="w-full mt-4" variant="outline" onClick={() => setActiveTab('profile')}>
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card className="hover-lift">
                <CardContent>
                  <CardTitle className="mb-4">Account</CardTitle>
                  <div className="space-y-3">
                    <Link href="/dashboard" className="block p-3 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
                      <p className="font-medium">📊 Overview</p>
                    </Link>
                    <Link href="/dashboard" className="block p-3 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
                      <p className="font-medium">📦 My Orders</p>
                    </Link>
                    <Link href="/dashboard" className="block p-3 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
                      <p className="font-medium">✈️ My Bookings</p>
                    </Link>
                    <button onClick={handleSignOut} className="block w-full text-left p-3 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors text-red-400">
                      <p className="font-medium">🚪 Sign Out</p>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Cart Preview */}
              {cartCount > 0 && (
                <Card className="border-amber-500/30">
                  <CardContent>
                    <CardTitle className="mb-4">🛒 Cart</CardTitle>
                    <div className="p-3 bg-amber-500/10 rounded-lg">
                      <p className="text-amber-400 font-medium">You have {cartCount} item(s) in cart</p>
                      <Link href="/checkout">
                        <Button size="sm" className="mt-2 w-full">View Cart</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}