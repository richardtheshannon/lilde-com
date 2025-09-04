import { useState, useEffect } from 'react'

export interface Task {
  id: string
  title: string
  description?: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  projectId: string
  assigneeId?: string | null
  assignee?: {
    id: string
    name: string | null
    email: string | null
  } | null
  parentId?: string | null
  parent?: {
    id: string
    title: string
  } | null
  category?: string | null
  dueDate?: string | null
  timeEstimate?: number | null
  timeSpent?: number | null
  createdAt: string
  updatedAt: string
  subtasks?: {
    id: string
    title: string
    status: string
  }[]
  comments?: {
    id: string
    content: string
    createdAt: string
    author: {
      id: string
      name: string | null
      email: string | null
    }
  }[]
  _count: {
    comments: number
  }
}

export function useTasks(projectId: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/projects/${projectId}/tasks`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`)
      }
      
      const tasks = await response.json()
      setTasks(tasks)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData: Partial<Task>) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        throw new Error(`Failed to create task: ${response.status}`)
      }

      const newTask = await response.json()
      setTasks(prev => [newTask, ...prev])
      return newTask
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
      throw err
    }
  }

  const updateTask = async (taskId: string, taskData: Partial<Task>) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        throw new Error(`Failed to update task: ${response.status}`)
      }

      const updatedTask = await response.json()
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ))
      return updatedTask
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
      throw err
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.status}`)
      }

      setTasks(prev => prev.filter(task => task.id !== taskId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task')
      throw err
    }
  }

  const getTaskById = async (taskId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch task: ${response.status}`)
      }
      
      return await response.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch task')
      throw err
    }
  }

  useEffect(() => {
    if (projectId) {
      fetchTasks()
    }
  }, [projectId])

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById
  }
}