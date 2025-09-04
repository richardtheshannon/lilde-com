import { useState, useEffect } from 'react'

export function useProjectsSimple() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Immediate test with hardcoded data first
    console.log('useProjectsSimple mounted')
    
    // Set some test data immediately to verify the hook works
    setProjects([
      { id: 'test1', name: 'Test Project 1', status: 'PLANNING' },
      { id: 'test2', name: 'Test Project 2', status: 'IN_PROGRESS' }
    ])
    setLoading(false)
    
    // Then try to fetch real data after a delay
    setTimeout(async () => {
      try {
        console.log('Attempting real fetch...')
        const response = await fetch('/api/projects')
        if (response.ok) {
          const data = await response.json()
          console.log('Got real data:', data)
          if (data && data.length > 0) {
            setProjects(data)
          }
        }
      } catch (err) {
        console.error('Fetch error:', err)
      }
    }, 1000)
  }, [])

  return { projects, loading, error }
}