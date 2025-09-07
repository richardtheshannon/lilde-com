'use client'

import React from 'react'

interface TimelineEvent {
  id: string
  projectId: string
  title: string
  description: string | null
  date: string
  type: string
  createdAt: string
  updatedAt: string
}

interface TimelineDisplayProps {
  timelineEvents: TimelineEvent[]
}

const TimelineDisplay: React.FC<TimelineDisplayProps> = ({ timelineEvents }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getEventTypeIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      'milestone': 'flag',
      'task': 'task_alt',
      'meeting': 'groups',
      'deadline': 'schedule',
      'release': 'rocket_launch',
      'default': 'event'
    }
    return iconMap[type] || iconMap.default
  }

  const getEventTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      'milestone': 'bg-blue-500',
      'task': 'bg-green-500',
      'meeting': 'bg-purple-500',
      'deadline': 'bg-red-500',
      'release': 'bg-orange-500',
      'default': 'bg-gray-500'
    }
    return colorMap[type] || colorMap.default
  }

  if (!timelineEvents || timelineEvents.length === 0) {
    return (
      <div className="form-section">
        <h3 className="form-section-title">
          <span className="material-symbols-outlined">timeline</span>
          Project Timeline Events
        </h3>
        <div className="empty-state">
          <span className="material-symbols-outlined empty-icon">timeline</span>
          <div className="empty-text">
            No timeline events yet. Timeline events are created when you upload a markdown file during project creation.
          </div>
        </div>
      </div>
    )
  }

  // Sort events by date
  const sortedEvents = [...timelineEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return (
    <div className="form-section">
      <h3 className="form-section-title">
        <span className="material-symbols-outlined">timeline</span>
        Project Timeline Events ({timelineEvents.length})
      </h3>
      
      <div className="timeline-events-container">
        {sortedEvents.map((event, index) => (
          <div key={event.id} className="timeline-event-item">
            <div className="timeline-event-connector">
              <div className={`timeline-event-dot ${getEventTypeColor(event.type)}`}>
                <span className="material-symbols-outlined timeline-event-icon">
                  {getEventTypeIcon(event.type)}
                </span>
              </div>
              {index < sortedEvents.length - 1 && (
                <div className="timeline-event-line"></div>
              )}
            </div>
            
            <div className="timeline-event-content">
              <div className="timeline-event-header">
                <h4 className="timeline-event-title">{event.title}</h4>
                <div className="timeline-event-date">
                  {formatDate(event.date)}
                </div>
              </div>
              
              {event.description && (
                <p className="timeline-event-description">
                  {event.description}
                </p>
              )}
              
              <div className="timeline-event-meta">
                <span className="timeline-event-type">
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
                <span className="timeline-event-created">
                  Added {new Date(event.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TimelineDisplay