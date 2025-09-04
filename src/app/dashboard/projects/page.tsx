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
  tasks: {
    id: string
    title: string
    completed: boolean
    category: string
    timeTracked: number
  }[]
  timeline: {
    id: string
    title: string
    date: string
    type: 'milestone' | 'event' | 'deadline'
    completed: boolean
  }[]
}

// Mock data removed - now using real database
/* const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Modern e-commerce solution with React and Node.js',
    status: 'active',
    priority: 'high',
    type: 'web_development',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    progress: 65,
    budget: 50000,
    teamMembers: ['John Doe', 'Jane Smith', 'Mike Johnson'],
    contacts: ['client@example.com', 'pm@example.com'],
    links: [
      { name: 'GitHub Repository', url: 'https://github.com/example/ecommerce', type: 'repository' },
      { name: 'Live Demo', url: 'https://demo.example.com', type: 'deployment' },
      { name: 'Documentation', url: 'https://docs.example.com', type: 'documentation' }
    ],
    tasks: [
      { id: '1', title: 'User Authentication', completed: true, category: 'Backend', timeTracked: 24 },
      { id: '2', title: 'Product Catalog', completed: true, category: 'Frontend', timeTracked: 32 },
      { id: '3', title: 'Payment Integration', completed: false, category: 'Backend', timeTracked: 16 }
    ],
    timeline: [
      { id: '1', title: 'Project Kickoff', date: '2024-01-15', type: 'milestone', completed: true },
      { id: '2', title: 'MVP Release', date: '2024-04-01', type: 'milestone', completed: true },
      { id: '3', title: 'Final Delivery', date: '2024-06-30', type: 'deadline', completed: false }
    ]
  },
  {
    id: '2',
    name: 'Mobile Banking App',
    description: 'Secure mobile banking application for iOS and Android',
    status: 'active',
    priority: 'critical',
    type: 'mobile_app',
    startDate: '2024-02-01',
    endDate: '2024-08-15',
    progress: 45,
    budget: 75000,
    teamMembers: ['Sarah Wilson', 'Tom Brown', 'Lisa Chen'],
    contacts: ['bank@example.com', 'security@example.com'],
    links: [
      { name: 'Private Repo', url: 'https://github.com/private/banking', type: 'repository' },
      { name: 'Security Docs', url: 'https://security-docs.example.com', type: 'documentation' }
    ],
    tasks: [
      { id: '4', title: 'Biometric Authentication', completed: true, category: 'Security', timeTracked: 40 },
      { id: '5', title: 'Transaction History', completed: false, category: 'Frontend', timeTracked: 20 },
      { id: '6', title: 'Push Notifications', completed: false, category: 'Backend', timeTracked: 8 }
    ],
    timeline: [
      { id: '4', title: 'Security Audit', date: '2024-03-15', type: 'milestone', completed: true },
      { id: '5', title: 'Beta Testing', date: '2024-06-01', type: 'milestone', completed: false },
      { id: '6', title: 'App Store Launch', date: '2024-08-15', type: 'deadline', completed: false }
    ]
  },
  {
    id: '3',
    name: 'Brand Identity Redesign',
    description: 'Complete brand identity and website redesign for tech startup',
    status: 'completed',
    priority: 'medium',
    type: 'marketing',
    startDate: '2023-10-01',
    endDate: '2024-01-31',
    progress: 100,
    budget: 25000,
    teamMembers: ['Alex Rivera', 'Emma Davis'],
    contacts: ['startup@example.com'],
    links: [
      { name: 'Brand Guidelines', url: 'https://brand.example.com', type: 'documentation' },
      { name: 'New Website', url: 'https://startup.example.com', type: 'deployment' }
    ],
    tasks: [
      { id: '7', title: 'Logo Design', completed: true, category: 'Design', timeTracked: 30 },
      { id: '8', title: 'Website Development', completed: true, category: 'Development', timeTracked: 45 },
      { id: '9', title: 'Brand Guidelines', completed: true, category: 'Documentation', timeTracked: 15 }
    ],
    timeline: [
      { id: '7', title: 'Logo Concepts', date: '2023-10-15', type: 'milestone', completed: true },
      { id: '8', title: 'Website Launch', date: '2024-01-15', type: 'milestone', completed: true },
      { id: '9', title: 'Project Completion', date: '2024-01-31', type: 'deadline', completed: true }
    ]
  },
  {
    id: '4',
    name: 'AI Research Initiative',
    description: 'Exploring machine learning applications for customer service',
    status: 'on_hold',
    priority: 'low',
    type: 'research',
    startDate: '2024-03-01',
    progress: 25,
    budget: 100000,
    teamMembers: ['Dr. James Wilson', 'Maria Garcia'],
    contacts: ['research@example.com'],
    links: [
      { name: 'Research Docs', url: 'https://research.example.com', type: 'documentation' }
    ],
    tasks: [
      { id: '10', title: 'Literature Review', completed: true, category: 'Research', timeTracked: 60 },
      { id: '11', title: 'Data Collection', completed: false, category: 'Research', timeTracked: 20 },
      { id: '12', title: 'Model Training', completed: false, category: 'Development', timeTracked: 0 }
    ],
    timeline: [
      { id: '10', title: 'Research Phase', date: '2024-03-01', type: 'milestone', completed: true },
      { id: '11', title: 'Prototype Demo', date: '2024-07-01', type: 'milestone', completed: false }
    ]
  },
  {
    id: '5',
    name: 'Custom Software Development',
    description: 'Full-stack application development for client requirements',
    status: 'active',
    priority: 'high',
    type: 'development',
    startDate: '2024-04-15',
    endDate: '2024-09-30',
    progress: 35,
    budget: 150000,
    teamMembers: ['Alex Johnson', 'Sarah Kim'],
    contacts: ['client@example.com', 'pm@example.com'],
    links: [
      { name: 'Project Repository', url: 'https://github.com/example/custom-app', type: 'repository' },
      { name: 'Client Portal', url: 'https://portal.client.com', type: 'deployment' }
    ],
    tasks: [
      { id: '12', title: 'Database Architecture', completed: true, category: 'Backend', timeTracked: 32 },
      { id: '13', title: 'API Development', completed: false, category: 'Backend', timeTracked: 18 },
      { id: '14', title: 'Frontend Framework Setup', completed: false, category: 'Frontend', timeTracked: 12 }
    ],
    timeline: [
      { id: '12', title: 'Development Kickoff', date: '2024-04-15', type: 'milestone', completed: true },
      { id: '13', title: 'MVP Demo', date: '2024-07-01', type: 'milestone', completed: false },
      { id: '14', title: 'Final Delivery', date: '2024-09-30', type: 'deadline', completed: false }
    ]
  },
  {
    id: '6',
    name: 'UI/UX Design System',
    description: 'Comprehensive design system and component library creation',
    status: 'planning',
    priority: 'medium',
    type: 'design',
    startDate: '2024-05-01',
    endDate: '2024-08-15',
    progress: 15,
    budget: 75000,
    teamMembers: ['Emma Davis', 'Lucas Brown'],
    contacts: ['design@example.com'],
    links: [
      { name: 'Design Files', url: 'https://figma.com/design-system', type: 'documentation' },
      { name: 'Style Guide', url: 'https://styleguide.example.com', type: 'documentation' }
    ],
    tasks: [
      { id: '15', title: 'Design Audit', completed: true, category: 'Design', timeTracked: 24 },
      { id: '16', title: 'Component Library', completed: false, category: 'Design', timeTracked: 8 },
      { id: '17', title: 'Documentation', completed: false, category: 'Design', timeTracked: 4 }
    ],
    timeline: [
      { id: '15', title: 'Design Research', date: '2024-05-01', type: 'milestone', completed: true },
      { id: '16', title: 'Component Design', date: '2024-06-15', type: 'milestone', completed: false },
      { id: '17', title: 'System Launch', date: '2024-08-15', type: 'deadline', completed: false }
    ]
  }
] */

type SortField = keyof Pick<Project, 'name' | 'status' | 'priority' | 'type' | 'startDate' | 'progress' | 'budget'>
type SortDirection = 'asc' | 'desc'

export default function ProjectsPage() {
  const searchParams = useSearchParams()
  const statusFilter = searchParams?.get('status')
  const router = useRouter()
  
  // API data loading
  const { projects: apiProjects, loading, error, deleteProject, refetch } = useProjects()

  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  // Map API projects to display format
  const mapApiProjectToDisplayProject = (apiProject: ApiProject): Project => ({
    id: apiProject.id,
    name: apiProject.name,
    description: apiProject.description || '',
    status: apiProject.status === 'IN_PROGRESS' ? 'active' : 
           apiProject.status === 'COMPLETED' ? 'completed' :
           apiProject.status === 'ON_HOLD' ? 'on_hold' : 'planning',
    priority: apiProject.priority === 'URGENT' ? 'critical' : (apiProject.priority || 'MEDIUM').toLowerCase() as Project['priority'],
    type: apiProject.projectType === 'DEVELOPMENT' ? 'development' :
          apiProject.projectType === 'DESIGN' ? 'design' :
          apiProject.projectType === 'MARKETING' ? 'marketing' :
          apiProject.projectType === 'RESEARCH' ? 'research' : 
          'consulting' as Project['type'],  // OTHER maps to consulting
    startDate: apiProject.startDate ? apiProject.startDate.split('T')[0] : new Date().toISOString().split('T')[0],
    endDate: apiProject.endDate ? apiProject.endDate.split('T')[0] : undefined,
    progress: Math.floor(Math.random() * 100), // Simulate progress based on status
    budget: apiProject.projectValue || undefined,
    teamMembers: [apiProject.owner?.name || 'Unknown'],
    contacts: [apiProject.owner?.email || ''],
    links: [],
    tasks: [],
    timeline: []
  })

  const displayProjects = useMemo(() => {
    return apiProjects.map(mapApiProjectToDisplayProject)
  }, [apiProjects])

  const filteredProjects = useMemo(() => {
    let filtered = displayProjects

    // Apply status filter from URL
    if (statusFilter) {
      filtered = filtered.filter(project => project.status === statusFilter)
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.teamMembers.some(member => member.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(project => project.type === selectedType)
    }

    // Apply priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(project => project.priority === selectedPriority)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      // Handle undefined values
      if (aValue === undefined || aValue === null) aValue = ''
      if (bValue === undefined || bValue === null) bValue = ''

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1
      }
      return 0
    })

    return filtered
  }, [displayProjects, searchTerm, sortField, sortDirection, selectedType, selectedPriority, statusFilter])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return 'unfold_more'
    return sortDirection === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
  }

  const getStatusBadgeClass = (status: Project['status']) => {
    const baseClass = 'px-2 py-1 rounded-full text-xs font-medium'
    switch (status) {
      case 'active': return `${baseClass} bg-green-100 text-green-800`
      case 'completed': return `${baseClass} bg-blue-100 text-blue-800`
      case 'on_hold': return `${baseClass} bg-yellow-100 text-yellow-800`
      case 'planning': return `${baseClass} bg-gray-100 text-gray-800`
      default: return `${baseClass} bg-gray-100 text-gray-800`
    }
  }

  const getPriorityBadgeClass = (priority: Project['priority']) => {
    const baseClass = 'px-2 py-1 rounded-full text-xs font-medium'
    switch (priority) {
      case 'critical': return `${baseClass} bg-red-100 text-red-800`
      case 'high': return `${baseClass} bg-orange-100 text-orange-800`
      case 'medium': return `${baseClass} bg-yellow-100 text-yellow-800`
      case 'low': return `${baseClass} bg-green-100 text-green-800`
      default: return `${baseClass} bg-gray-100 text-gray-800`
    }
  }

  const getProjectTypeBadgeClass = (type: Project['type']) => {
    const baseClass = 'px-2 py-1 rounded-full text-xs font-medium'
    switch (type) {
      case 'web_development': return `${baseClass} bg-blue-100 text-blue-800`
      case 'mobile_app': return `${baseClass} bg-purple-100 text-purple-800`
      case 'consulting': return `${baseClass} bg-indigo-100 text-indigo-800`
      case 'research': return `${baseClass} bg-teal-100 text-teal-800`
      case 'marketing': return `${baseClass} bg-pink-100 text-pink-800`
      case 'development': return `${baseClass} bg-cyan-100 text-cyan-800`
      case 'design': return `${baseClass} bg-rose-100 text-rose-800`
      default: return `${baseClass} bg-gray-100 text-gray-800`
    }
  }

  // Action handlers
  const handleViewProject = (projectId: string) => {
    router.push(`/dashboard/projects/${projectId}`)
  }

  const handleEditProject = (projectId: string) => {
    router.push(`/dashboard/projects/${projectId}/edit`)
  }

  const handleDeleteProject = async (project: Project) => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      try {
        await deleteProject(project.id)
      } catch (error) {
        console.error('Failed to delete project:', error)
      }
    }
  }

  // Error state
  if (loading) {
    return (
      <div className="safe-margin">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-400 mb-4 block animate-spin">refresh</span>
            <h3 className="text-lg font-medium text-gray-100 mb-2">Loading projects...</h3>
            <p className="text-gray-300">Please wait while we fetch your projects</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="safe-margin">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900 border border-red-700 rounded-lg p-6 text-center">
            <span className="material-symbols-outlined text-6xl text-red-400 mb-4 block">error</span>
            <h3 className="text-lg font-medium text-red-100 mb-2">Failed to load projects</h3>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="safe-margin">
      <div className="grid grid-cols-3 gap-6 items-start" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'start' }}>
        {/* Left Column - 1/3 */}
        <div className="main-content-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {statusFilter ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1).replace('_', ' ')} Projects` : 'All Projects'}
              </h1>
              <p className="text-gray-300">Manage and track your project portfolio</p>
            </div>
            <a
              href="/dashboard/projects/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              New Project
            </a>
          </div>
          
          {/* Project Stats Summary */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-2">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Projects:</span>
                  <span className="text-white">{loading ? '...' : displayProjects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Active:</span>
                  <span className="text-green-400">{loading ? '...' : displayProjects.filter(p => p.status === 'active').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Completed:</span>
                  <span className="text-blue-400">{loading ? '...' : displayProjects.filter(p => p.status === 'completed').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">On Hold:</span>
                  <span className="text-yellow-400">{loading ? '...' : displayProjects.filter(p => p.status === 'on_hold').length}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-2">Filter Results</h3>
              <p className="text-sm text-gray-300">
                {loading ? 'Loading projects...' : `Showing ${filteredProjects.length} of ${displayProjects.length} projects`}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - 2/3 */}
        <div className="main-content-right">
          {/* Filters and Search */}
          <div className="mb-6 flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="web_development">Web Development</option>
              <option value="mobile_app">Mobile App</option>
              <option value="consulting">Consulting</option>
              <option value="research">Research</option>
              <option value="marketing">Marketing</option>
              <option value="development">Development</option>
              <option value="design">Design</option>
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Projects Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  onClick={() => handleSort('name')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Project Name
                    <span className="material-symbols-outlined text-sm">{getSortIcon('name')}</span>
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('status')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Status
                    <span className="material-symbols-outlined text-sm">{getSortIcon('status')}</span>
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('priority')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Priority
                    <span className="material-symbols-outlined text-sm">{getSortIcon('priority')}</span>
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('type')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Type
                    <span className="material-symbols-outlined text-sm">{getSortIcon('type')}</span>
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('progress')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Progress
                    <span className="material-symbols-outlined text-sm">{getSortIcon('progress')}</span>
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('startDate')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Start Date
                    <span className="material-symbols-outlined text-sm">{getSortIcon('startDate')}</span>
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('budget')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Budget
                    <span className="material-symbols-outlined text-sm">{getSortIcon('budget')}</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        <button
                          onClick={() => handleViewProject(project.id)}
                          className="hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {project.name}
                        </button>
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{project.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadgeClass(project.status)}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getPriorityBadgeClass(project.priority)}>
                      {project.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getProjectTypeBadgeClass(project.type)}>
                      {project.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(project.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.budget ? `$${project.budget.toLocaleString()}` : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex -space-x-1">
                      {project.teamMembers.slice(0, 3).map((member, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 border-2 border-white"
                          title={member}
                        >
                          {member.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                      {project.teamMembers.length > 3 && (
                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-white">
                          +{project.teamMembers.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewProject(project.id)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="View project details"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                      </button>
                      <button 
                        onClick={() => handleEditProject(project.id)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="Edit project"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(project)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete project"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
              </table>
            </div>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">folder_open</span>
              <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
              <p className="text-gray-400">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}