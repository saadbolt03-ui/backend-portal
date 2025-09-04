import React, { useState, useEffect } from 'react'
import { Users, Building2, UserCheck, Shield } from 'lucide-react'
import { usersAPI, companiesAPI } from '../services/api'
import toast from 'react-hot-toast'

interface Stats {
  totalUsers: number
  verifiedUsers: number
  totalCompanies: number
  activeCompanies: number
  recentUsers: any[]
  recentCompanies: any[]
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    verifiedUsers: 0,
    totalCompanies: 0,
    activeCompanies: 0,
    recentUsers: [],
    recentCompanies: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [usersResponse, companiesResponse] = await Promise.all([
        usersAPI.getAllUsers(1, 50),
        companiesAPI.getAllCompanies()
      ])

      if (usersResponse.data.success && companiesResponse.data.success) {
        const users = usersResponse.data.data.users
        const companies = companiesResponse.data.data.companies

        setStats({
          totalUsers: users.length,
          verifiedUsers: users.filter((u: any) => u.isEmailVerified).length,
          totalCompanies: companies.length,
          activeCompanies: companies.filter((c: any) => c.isActive).length,
          recentUsers: users.slice(0, 5),
          recentCompanies: companies.slice(0, 5)
        })
      }
    } catch (error: any) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Verified Users',
      value: stats.verifiedUsers,
      icon: UserCheck,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Total Companies',
      value: stats.totalCompanies,
      icon: Building2,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'Active Companies',
      value: stats.activeCompanies,
      icon: Shield,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
          <div className="space-y-3">
            {stats.recentUsers.map((user: any) => (
              <div key={user._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-xs">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div>
                  {user.isEmailVerified ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Companies */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Companies</h3>
          <div className="space-y-3">
            {stats.recentCompanies.map((company: any) => (
              <div key={company._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{company.name}</p>
                    <p className="text-xs text-gray-500">
                      {company.domains.length} domain{company.domains.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div>
                  {company.isActive ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}