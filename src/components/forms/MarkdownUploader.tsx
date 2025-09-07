'use client'

import React, { useCallback, useState } from 'react'
import { validateMarkdownFile, readFileAsText, parseMarkdownHeaders, MarkdownParseResult } from '@/lib/markdownParser'

interface MarkdownUploaderProps {
  onFileProcessed: (result: MarkdownParseResult, file: File) => void
  onError: (error: string) => void
  onClear: () => void
  currentFile?: File | null
}

export default function MarkdownUploader({ 
  onFileProcessed, 
  onError, 
  onClear, 
  currentFile 
}: MarkdownUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFile = useCallback(async (file: File) => {
    const validation = validateMarkdownFile(file)
    
    if (!validation.valid) {
      onError(validation.error || 'Invalid file')
      return
    }

    setIsProcessing(true)
    
    try {
      const content = await readFileAsText(file)
      const parseResult = parseMarkdownHeaders(content)
      
      if (parseResult.headers.length === 0) {
        onError('No H1 headers found in markdown file. Please add headers starting with "# " to generate timeline events.')
        setIsProcessing(false)
        return
      }
      
      onFileProcessed(parseResult, file)
    } catch (err) {
      onError('Failed to process markdown file')
    } finally {
      setIsProcessing(false)
    }
  }, [onFileProcessed, onError])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
    e.target.value = '' // Reset input to allow same file selection
  }, [handleFile])

  const handleClear = useCallback(() => {
    onClear()
    setIsProcessing(false)
    setIsDragging(false)
  }, [onClear])

  return (
    <div className="markdown-uploader">
      {currentFile ? (
        <div className="markdown-file-selected">
          <div className="file-info">
            <span className="material-symbols-outlined">description</span>
            <div className="file-details">
              <p className="file-name">{currentFile.name}</p>
              <p className="file-size">
                {(currentFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="file-remove-btn"
            disabled={isProcessing}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      ) : (
        <div
          className={`markdown-dropzone ${isDragging ? 'dragging' : ''} ${isProcessing ? 'processing' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="dropzone-content">
            {isProcessing ? (
              <>
                <span className="material-symbols-outlined animate-spin">refresh</span>
                <p className="dropzone-text">Processing markdown file...</p>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">upload_file</span>
                <p className="dropzone-text">
                  Drop your markdown file here, or{' '}
                  <label htmlFor="markdown-file-input" className="file-select-link">
                    browse files
                  </label>
                </p>
                <p className="dropzone-subtext">
                  Supports .md, .markdown files (max 5MB)
                </p>
              </>
            )}
          </div>
          <input
            id="markdown-file-input"
            type="file"
            accept=".md,.markdown,.mdown,.mkdn,.mdwn"
            onChange={handleFileSelect}
            className="file-input-hidden"
            disabled={isProcessing}
          />
        </div>
      )}
    </div>
  )
}