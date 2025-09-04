'use client'

import { useState, useEffect } from 'react'

export default function Footer() {
  const [debugBordersEnabled, setDebugBordersEnabled] = useState(false)
  const [footerFixed, setFooterFixed] = useState(false)

  const toggleDebugBorders = () => {
    const newState = !debugBordersEnabled
    setDebugBordersEnabled(newState)
    
    // Toggle the debug styles by adding/removing a class to the body
    if (newState) {
      document.body.classList.add('debug-borders-enabled')
    } else {
      document.body.classList.remove('debug-borders-enabled')
    }
  }

  const toggleFooterFixed = () => {
    const newState = !footerFixed
    setFooterFixed(newState)
    
    // Save state to localStorage
    localStorage.setItem('footerFixed', JSON.stringify(newState))
    
    // Toggle the fixed footer by adding/removing a class to the footer
    const footer = document.querySelector('.footer')
    if (footer) {
      if (newState) {
        footer.classList.add('footer-fixed')
      } else {
        footer.classList.remove('footer-fixed')
      }
    }
  }

  // Check initial state on mount
  useEffect(() => {
    const hasDebugBorders = document.body.classList.contains('debug-borders-enabled')
    setDebugBordersEnabled(hasDebugBorders)
    
    // Load footer fixed state from localStorage
    const savedFooterState = localStorage.getItem('footerFixed')
    if (savedFooterState !== null) {
      const isFixed = JSON.parse(savedFooterState)
      setFooterFixed(isFixed)
      
      // Apply the fixed class if needed
      const footer = document.querySelector('.footer')
      if (footer && isFixed) {
        footer.classList.add('footer-fixed')
      }
    }
  }, [])

  return (
    <footer className="footer">
      <div className="footer-left">
        <button className="footer-icon">
          <span className="material-symbols-outlined">format_indent_increase</span>
        </button>
      </div>
      <div className="footer-center">
        <button className="footer-icon">
          <span className="material-symbols-outlined">code</span>
        </button>
      </div>
      <div className="footer-right">
        <button className="footer-icon" onClick={toggleFooterFixed} title={footerFixed ? "Release Footer" : "Fix Footer"}>
          <span className="material-symbols-outlined">place_item</span>
        </button>
        <button className="footer-icon" onClick={toggleDebugBorders} title={debugBordersEnabled ? "Hide Debug Borders" : "Show Debug Borders"}>
          <span className="material-symbols-outlined">
            {debugBordersEnabled ? 'border_outer' : 'border_style'}
          </span>
        </button>
        <button className="footer-icon">
          <span className="material-symbols-outlined">expand_circle_up</span>
        </button>
      </div>
    </footer>
  )
}