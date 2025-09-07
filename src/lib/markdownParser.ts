export interface TimelineEvent {
  title: string
  description?: string
  date: Date
  type: string
}

export interface MarkdownParseResult {
  headers: string[]
  content: string
  previewHtml: string
}

/**
 * Parse markdown content and extract H1 headers for timeline generation
 */
export function parseMarkdownHeaders(content: string): MarkdownParseResult {
  if (!content.trim()) {
    return { headers: [], content: '', previewHtml: '' }
  }

  // Extract H1 headers (lines starting with # followed by space)
  const h1Regex = /^#\s+(.+)$/gm
  const headers: string[] = []
  let match

  while ((match = h1Regex.exec(content)) !== null) {
    headers.push(match[1].trim())
  }

  // Generate basic HTML preview (simple markdown-to-HTML conversion)
  const previewHtml = content
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
  
  return {
    headers,
    content,
    previewHtml: `<p>${previewHtml}</p>`
  }
}

/**
 * Generate timeline events from markdown headers with specified spacing
 */
export function generateTimelineEvents(
  headers: string[],
  startDate: Date,
  spacingDays: number
): TimelineEvent[] {
  if (!headers.length) return []

  const events: TimelineEvent[] = []
  
  headers.forEach((header, index) => {
    const eventDate = new Date(startDate)
    eventDate.setDate(startDate.getDate() + (index * spacingDays))
    
    events.push({
      title: header,
      description: `Generated from markdown H1 header: "${header}"`,
      date: eventDate,
      type: 'milestone'
    })
  })

  return events
}

/**
 * Validate uploaded file is a markdown file
 */
export function validateMarkdownFile(file: File): { valid: boolean; error?: string } {
  // Check file extension
  const validExtensions = ['.md', '.markdown', '.mdown', '.mkdn', '.mdwn']
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
  
  if (!validExtensions.includes(fileExtension)) {
    return {
      valid: false,
      error: `Invalid file type. Please upload a markdown file (${validExtensions.join(', ')})`
    }
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Maximum size is 5MB.'
    }
  }

  // More permissive MIME type checking for markdown files
  // Many markdown files have no MIME type or application/octet-stream
  const allowedMimeTypes = [
    'text/markdown',
    'text/x-markdown', 
    'text/plain',
    'application/octet-stream',
    '' // Empty MIME type is common for .md files
  ]
  
  if (file.type && !allowedMimeTypes.includes(file.type)) {
    // Only reject if it's clearly a non-text file type
    if (file.type.startsWith('image/') || 
        file.type.startsWith('video/') || 
        file.type.startsWith('audio/') ||
        file.type.includes('pdf') ||
        file.type.includes('zip') ||
        file.type.includes('binary')) {
      return {
        valid: false,
        error: 'File must be a text-based markdown file.'
      }
    }
  }

  return { valid: true }
}

/**
 * Read file content as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      const content = event.target?.result as string
      resolve(content || '')
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsText(file)
  })
}