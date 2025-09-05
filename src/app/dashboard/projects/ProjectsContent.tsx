'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useProjects, ApiProject } from '@/hooks/useProjects'

export interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'on_hold' | 'planning'
  priority: 'low' | 'medium' | 'high' | 'critical'
  type: 'web_development' | 'mobile_app' | 'consulting' | 'research' | 'marketing' | 'development' | 'design'
  startDate: string
  endDate?: string
  progress: number
  budget?: number
  teamMembers: string[]
  contacts: string[]
  links: { name: string; url: string; type: 'repository' | 'documentation' | 'deployment' | 'other' }[]
}

type SortField = 'name' | 'status' | 'priority' | 'startDate' | 'endDate' | 'progress'
type SortDirection = 'asc' | 'desc'

export default function ProjectsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { projects: apiProjects, loading, error, deleteProject } = useProjects()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('startDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  // Map API projects to component projects
  const projects: Project[] = useMemo(() => {
    return apiProjects.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description || '',
      status: mapApiStatus(p.status),
      priority: mapApiPriority(p.priority),
      type: mapApiType(p.projectType),
      startDate: p.startDate || new Date().toISOString(),
      endDate: p.endDate || undefined,
      progress: calculateProgress(p.status),
      budget: p.projectValue || undefined,
      teamMembers: [p.owner?.name || p.owner?.email || 'Unknown'],
      contacts: [],
      links: p.website ? [{ name: 'Website', url: p.website, type: 'other' as const }] : []
    }))
  }, [apiProjects])

  // Helper functions to map API types to component types
  function mapApiStatus(status: string): Project['status'] {
    const statusMap: Record<string, Project['status']> = {
      'PLANNING': 'planning',
      'IN_PROGRESS': 'active',
      'ON_HOLD': 'on_hold',
      'COMPLETED': 'completed',
      'CANCELLED': 'on_hold'
    }
    return statusMap[status] || 'planning'
  }

  function mapApiPriority(priority: string): Project['priority'] {
    const priorityMap: Record<string, Project['priority']> = {
      'LOW': 'low',
      'MEDIUM': 'medium',
      'HIGH': 'high',
      'URGENT': 'critical'
    }
    return priorityMap[priority] || 'medium'
  }

  function mapApiType(type: string): Project['type'] {
    const typeMap: Record<string, Project['type']> = {
      'DEVELOPMENT': 'development',
      'DESIGN': 'design',
      'MARKETING': 'marketing',
      'RESEARCH': 'research',
      'OTHER': 'consulting'
    }
    return typeMap[type] || 'development'
  }

  function calculateProgress(status: string): number {
    const progressMap: Record<string, number> = {
      'PLANNING': 10,
      'IN_PROGRESS': 50,
      'ON_HOLD': 30,
      'COMPLETED': 100,
      'CANCELLED': 0
    }
    return progressMap[status] || 0
  }

  // Update filters from URL params
  useEffect(() => {
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const type = searchParams.get('type')
    
    if (status) setFilterStatus(status)
    if (priority) setFilterPriority(priority)
    if (type) setFilterType(type)
  }, [searchParams])

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || project.status === filterStatus
      const matchesPriority = filterPriority === 'all' || project.priority === filterPriority
      const matchesType = filterType === 'all' || project.type === filterType
      
      return matchesSearch && matchesStatus && matchesPriority && matchesType
    })

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]
      
      if (sortField === 'startDate' || sortField === 'endDate') {
        aValue = aValue ? new Date(aValue).getTime() : 0
        bValue = bValue ? new Date(bValue).getTime() : 0
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [projects, searchTerm, filterStatus, filterPriority, filterType, sortField, sortDirection])

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = projects.length
    const active = projects.filter(p => p.status === 'active').length
    const completed = projects.filter(p => p.status === 'completed').length
    const planning = projects.filter(p => p.status === 'planning').length
    const onHold = projects.filter(p => p.status === 'on_hold').length
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0)
    
    return { total, active, completed, planning, onHold, totalBudget }
  }, [projects])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }
    
    try {
      await deleteProject(projectId)
    } catch (err) {
      console.error('Failed to delete project:', err)
      alert('Failed to delete project. Please try again.')
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Not set'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusBadge = (status: Project['status']) => {
    const statusStyles = {
      active: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      on_hold: 'bg-yellow-100 text-yellow-800',
      planning: 'bg-gray-100 text-gray-800'
    }
    return statusStyles[status]
  }

  const getPriorityBadge = (priority: Project['priority']) => {
    const priorityStyles = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-blue-100 text-blue-600',
      high: 'bg-orange-100 text-orange-600',
      critical: 'bg-red-100 text-red-600'
    }
    return priorityStyles[priority]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading projects...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-400">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <main className="main-content-left">
        <div className="p-6">
          {/* Header with Create Button */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
              <p className="text-gray-400">Manage and track all your projects</p>
            </div>
            <button 
              onClick={() => router.push('/dashboard/projects/new')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add</span>
              New Project
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="text-2xl font-bold text-white">{statistics.total}</div>
              <div className="text-sm text-gray-400">Total Projects</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="text-2xl font-bold text-blue-400">{statistics.active}</div>
              <div className="text-sm text-gray-400">Active</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="text-2xl font-bold text-green-400">{statistics.completed}</div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="text-2xl font-bold text-gray-400">{statistics.planning}</div>
              <div className="text-sm text-gray-400">Planning</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="text-2xl font-bold text-yellow-400">{statistics.onHold}</div>
              <div className="text-sm text-gray-400">On Hold</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="text-xl font-bold text-purple-400">{formatCurrency(statistics.totalBudget)}</div>
              <div className="text-sm text-gray-400">Total Value</div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
              <select
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <select
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="development">Development</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="research">Research</option>
                <option value="consulting">Consulting</option>
              </select>
            </div>
          </div>

          {/* Projects Table */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <button
                        className="text-xs font-medium text-gray-400 uppercase tracking-wider hover:text-white"
                        onClick={() => handleSort('name')}
                      >
                        Project Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        className="text-xs font-medium text-gray-400 uppercase tracking-wider hover:text-white"
                        onClick={() => handleSort('status')}
                      >
                        Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        className="text-xs font-medium text-gray-400 uppercase tracking-wider hover:text-white"
                        onClick={() => handleSort('priority')}
                      >
                        Priority {sortField === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        className="text-xs font-medium text-gray-400 uppercase tracking-wider hover:text-white"
                        onClick={() => handleSort('startDate')}
                      >
                        Start Date {sortField === 'startDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        className="text-xs font-medium text-gray-400 uppercase tracking-wider hover:text-white"
                        onClick={() => handleSort('progress')}
                      >
                        Progress {sortField === 'progress' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Team
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredAndSortedProjects.map(project => (
                    <tr key={project.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-white">{project.name}</div>
                          <div className="text-sm text-gray-400 truncate max-w-xs">{project.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(project.status)}`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(project.priority)}`}>
                          {project.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {project.type.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {formatDate(project.startDate)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 mt-1">{project.progress}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2">
                          {project.teamMembers.slice(0, 3).map((member, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 bg-gray-600 rounded-full border-2 border-gray-800 flex items-center justify-center"
                              title={member}
                            >
                              <span className="text-xs text-white">
                                {member.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          ))}
                          {project.teamMembers.length > 3 && (
                            <div className="w-8 h-8 bg-gray-700 rounded-full border-2 border-gray-800 flex items-center justify-center">
                              <span className="text-xs text-gray-300">
                                +{project.teamMembers.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                            className="text-gray-400 hover:text-white"
                            title="View Details"
                          >
                            <span className="material-symbols-outlined text-20">visibility</span>
                          </button>
                          <button 
                            onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
                            className="text-gray-400 hover:text-white"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-20">edit</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-gray-400 hover:text-red-400"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-20">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredAndSortedProjects.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' || filterType !== 'all' 
                    ? 'No projects match your filters' 
                    : 'No projects yet. Create your first project!'}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <aside className="main-content-right">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="text-sm text-gray-400 mb-2">Completion Rate</h3>
              <div className="text-2xl font-bold text-green-400">
                {statistics.total > 0 
                  ? Math.round((statistics.completed / statistics.total) * 100) 
                  : 0}%
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="text-sm text-gray-400 mb-2">Active Projects</h3>
              <div className="space-y-2 mt-2">
                {projects
                  .filter(p => p.status === 'active')
                  .slice(0, 3)
                  .map(project => (
                    <div key={project.id} className="text-sm">
                      <div className="text-white">{project.name}</div>
                      <div className="text-gray-500 text-xs">{project.progress}% complete</div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="text-sm text-gray-400 mb-2">Recent Activity</h3>
              <div className="text-sm text-gray-500">No recent activity</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}