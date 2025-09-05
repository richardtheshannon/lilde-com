'use client'

import React, { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useProjects } from '@/hooks/useProjects'
import TaskList from '@/components/tasks/TaskList'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { projects, loading, error, deleteProject, updateProject } = useProjects()
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  
  const projectId = params?.id as string
  const project = projects.find(p => p.id === projectId)

  // Calculate project metrics
  const projectMetrics = useMemo(() => {
    if (!project) return null
    
    const daysSinceStart = project.startDate 
      ? Math.floor((new Date().getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0
    
    const daysUntilEnd = project.endDate
      ? Math.floor((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : null
    
    const totalDuration = project.startDate && project.endDate
      ? Math.floor((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))
      : null
    
    const progressPercent = totalDuration && daysSinceStart > 0
      ? Math.min(Math.max((daysSinceStart / totalDuration) * 100, 0), 100)
      : 0
    
    return {
      daysSinceStart: Math.max(daysSinceStart, 0),
      daysUntilEnd,
      totalDuration,
      progressPercent: Math.round(progressPercent),
      isOverdue: daysUntilEnd !== null && daysUntilEnd < 0
    }
  }, [project])

  // Status update handler
  const handleStatusUpdate = async (newStatus: string) => {
    if (!project) return
    
    try {
      setActionLoading('status')
      await updateProject(project.id, { status: newStatus as any })
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setActionLoading(null)
    }
  }

  // Priority update handler  
  const handlePriorityUpdate = async (newPriority: string) => {
    if (!project) return
    
    try {
      setActionLoading('priority')
      await updateProject(project.id, { priority: newPriority as any })
    } catch (error) {
      console.error('Failed to update priority:', error)
    } finally {
      setActionLoading(null)
    }
  }

  // Delete handler
  const handleDelete = async () => {
    if (!project) return
    
    if (window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      try {
        setActionLoading('delete')
        await deleteProject(project.id)
        router.push('/dashboard/projects')
      } catch (error) {
        console.error('Failed to delete project:', error)
        setActionLoading(null)
      }
    }
  }

  // Get status badge styling
  const getStatusBadgeStyle = (status: string) => {
    const styles = {
      'PLANNING': 'bg-gray-500 text-white',
      'IN_PROGRESS': 'bg-blue-500 text-white', 
      'ON_HOLD': 'bg-yellow-500 text-white',
      'COMPLETED': 'bg-green-500 text-white',
      'CANCELLED': 'bg-red-500 text-white'
    }
    return styles[status as keyof typeof styles] || 'bg-gray-500 text-white'
  }

  // Get priority badge styling
  const getPriorityBadgeStyle = (priority: string) => {
    const styles = {
      'LOW': 'bg-green-100 text-green-800 border-green-300',
      'MEDIUM': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'HIGH': 'bg-orange-100 text-orange-800 border-orange-300',
      'URGENT': 'bg-red-100 text-red-800 border-red-300'
    }
    return styles[priority as keyof typeof styles] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  // Loading state
  if (loading) {
    return (
      <div className="safe-margin">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <span className="material-symbols-outlined animate-spin text-4xl text-blue-500 mb-4 block">refresh</span>
              <p className="text-gray-400">Loading project details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="safe-margin">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-900 border border-red-700 rounded-lg p-6 text-center">
            <span className="material-symbols-outlined text-6xl text-red-400 mb-4 block">error</span>
            <h3 className="text-lg font-medium text-red-100 mb-2">Failed to load project</h3>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  // Project not found
  if (!project) {
    return (
      <div className="safe-margin">
        <div className="max-w-6xl mx-auto">
          <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-6 text-center">
            <span className="material-symbols-outlined text-6xl text-yellow-400 mb-4 block">search_off</span>
            <h3 className="text-lg font-medium text-yellow-100 mb-2">Project Not Found</h3>
            <p className="text-yellow-300">The project you're looking for doesn't exist or has been deleted.</p>
            <button 
              onClick={() => router.push('/dashboard/projects')}
              className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="safe-margin">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <button 
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h1 className="text-3xl font-bold text-white">{project.name}</h1>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeStyle(project.status)}`}>
                {project.status.replace('_', ' ')}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityBadgeStyle(project.priority)}`}>
                {project.priority}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300">
                {project.projectType.replace('_', ' ')}
              </span>
            </div>
            {project.description && (
              <p className="text-gray-300 text-lg">{project.description}</p>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2 ml-6">
            <button 
              onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Edit
            </button>
            <button 
              onClick={handleDelete}
              disabled={actionLoading === 'delete'}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {actionLoading === 'delete' ? (
                <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
              ) : (
                <span className="material-symbols-outlined text-sm">delete</span>
              )}
              Delete
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Project Overview */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">info</span>
                Project Overview
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.projectGoal && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Project Goal</h3>
                    <p className="text-white">{project.projectGoal}</p>
                  </div>
                )}
                
                {project.website && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Website</h3>
                    <a 
                      href={project.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                    >
                      {project.website}
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  </div>
                )}
                
                {project.projectValue && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Project Value</h3>
                    <p className="text-white font-semibold">${project.projectValue.toLocaleString()}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Owner</h3>
                  <p className="text-white">{project.owner.name || 'Unknown'}</p>
                  <p className="text-gray-400 text-sm">{project.owner.email}</p>
                </div>
              </div>
            </div>

            {/* Task Management Section */}
            <TaskList projectId={projectId} />

            {/* Timeline Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">schedule</span>
                Timeline
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.startDate && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-gray-400 text-sm">Start Date</p>
                        <p className="text-white font-medium">
                          {new Date(project.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {project.endDate && (
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${projectMetrics?.isOverdue ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                      <div>
                        <p className="text-gray-400 text-sm">End Date</p>
                        <p className={`font-medium ${projectMetrics?.isOverdue ? 'text-red-400' : 'text-white'}`}>
                          {new Date(project.endDate).toLocaleDateString()}
                          {projectMetrics?.isOverdue && (
                            <span className="ml-2 text-red-400 text-sm">(Overdue)</span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Progress Bar */}
                {projectMetrics && projectMetrics.totalDuration && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-gray-400 text-sm">Time Progress</p>
                      <p className="text-white text-sm font-medium">{projectMetrics.progressPercent}%</p>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          projectMetrics.isOverdue ? 'bg-red-500' : 
                          projectMetrics.progressPercent > 80 ? 'bg-orange-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(projectMetrics.progressPercent, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                      <span>
                        {projectMetrics.daysSinceStart} days elapsed
                      </span>
                      <span>
                        {projectMetrics.daysUntilEnd !== null 
                          ? `${Math.abs(projectMetrics.daysUntilEnd)} days ${projectMetrics.daysUntilEnd < 0 ? 'overdue' : 'remaining'}`
                          : 'No end date set'
                        }
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Project Statistics */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">analytics</span>
                Statistics
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">0</div>
                  <div className="text-gray-400 text-sm">Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">1</div>
                  <div className="text-gray-400 text-sm">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {projectMetrics?.daysSinceStart || 0}
                  </div>
                  <div className="text-gray-400 text-sm">Days Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    {project.updatedAt ? Math.floor((new Date().getTime() - new Date(project.updatedAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                  </div>
                  <div className="text-gray-400 text-sm">Days Since Update</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Info */}
          <div className="space-y-6">
            
            {/* Quick Status Update */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                  <select 
                    value={project.status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    disabled={actionLoading === 'status'}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  >
                    <option value="PLANNING">Planning</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Priority</label>
                  <select 
                    value={project.priority}
                    onChange={(e) => handlePriorityUpdate(e.target.value)}
                    disabled={actionLoading === 'priority'}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Project Dates */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Important Dates</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-white">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Updated:</span>
                  <span className="text-white">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                {project.startDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Start Date:</span>
                    <span className="text-white">
                      {new Date(project.startDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {project.endDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">End Date:</span>
                    <span className={projectMetrics?.isOverdue ? 'text-red-400' : 'text-white'}>
                      {new Date(project.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Project ID & Technical Info */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Technical Info</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Project ID:</span>
                  <div className="mt-1 font-mono text-xs text-gray-300 bg-gray-700 px-2 py-1 rounded">
                    {project.id}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white">{project.projectType.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}