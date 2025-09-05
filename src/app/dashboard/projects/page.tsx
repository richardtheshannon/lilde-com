import { Suspense } from 'react'
import ProjectsContent from './ProjectsContent'

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading projects...</div>
      </div>
    }>
      <ProjectsContent />
    </Suspense>
  )
}