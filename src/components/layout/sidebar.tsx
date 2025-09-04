'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SubNavItem {
  title: string
  icon: string
  href: string
}

interface NavItem {
  title: string
  icon: string
  href?: string
  subItems?: SubNavItem[]
}

const navItems: NavItem[] = [
  {
    title: 'Home Dashboard',
    icon: 'home',
    href: '/',
  },
  {
    title: 'Projects',
    icon: 'folder_open',
    subItems: [
      { title: 'All Projects', icon: 'view_list', href: '/dashboard/projects' },
      { title: 'Active Projects', icon: 'trending_up', href: '/dashboard/projects?status=active' },
      { title: 'Completed Projects', icon: 'task_alt', href: '/dashboard/projects?status=completed' },
      { title: 'On Hold', icon: 'pause_circle', href: '/dashboard/projects?status=on_hold' },
    ],
  },
]

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeSubNavs, setActiveSubNavs] = useState<Set<string>>(new Set())
  const router = useRouter()

  // Load sidebar state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarExpanded')
    if (savedState !== null) {
      const expanded = JSON.parse(savedState)
      setIsExpanded(expanded)
    }
  }, [])

  const toggleMenu = () => {
    const newState = !isExpanded
    setIsExpanded(newState)
    
    // Save state to localStorage
    localStorage.setItem('sidebarExpanded', JSON.stringify(newState))
    
    if (newState === false) {
      setActiveSubNavs(new Set())
    }
  }

  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    // If sidebar is collapsed and item has subItems, navigate to first sub-item
    if (!isExpanded && item.subItems && item.subItems.length > 0) {
      router.push(item.subItems[0].href)
      return
    }
    
    // If sidebar is expanded and item has subItems, toggle the sub-navigation
    if (isExpanded && item.subItems) {
      e.preventDefault()
      e.stopPropagation()
      
      const newActiveSubNavs = new Set(activeSubNavs)
      if (newActiveSubNavs.has(item.title)) {
        newActiveSubNavs.delete(item.title)
      } else {
        newActiveSubNavs.clear()
        newActiveSubNavs.add(item.title)
      }
      setActiveSubNavs(newActiveSubNavs)
    }
  }

  return (
    <div 
      className={`main-menu-sidebar ${isExpanded ? 'expanded' : ''}`}
      id="mainMenuSidebar"
    >
      <div className="header-area">
        {isExpanded && (
          <div className="menu-header-expanded">
            <button className="header-icon">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <button className="header-icon">
              <span className="material-symbols-outlined">info</span>
            </button>
            <button className="header-icon">
              <span className="material-symbols-outlined">person</span>
            </button>
          </div>
        )}
        <button className="header-logout">
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>
      
      <div className="nav-items-container">
        {isExpanded && (
          <div className="sidebar-logo">
            <img 
              src="/media/20Highline_Primary-Logo_Blooms_RGB.png" 
              alt="Highline Logo" 
              className="logo-image"
              style={{ 
                maxWidth: '220px', 
                maxHeight: 'auto', 
                width: 'auto', 
                height: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
        )}
        
        <div className="nav-items-main">
          {navItems.map((item) => (
            <div key={item.title} className="nav-item-group">
              {item.href ? (
                <Link
                  href={item.href}
                  className="menu-icon-link"
                >
                  <span>{item.title}</span>
                  <span className="material-symbols-outlined">{item.icon}</span>
                </Link>
              ) : (
                <>
                  <a
                    href={!isExpanded && item.subItems ? item.subItems[0].href : '#'}
                    onClick={(e) => handleNavClick(item, e)}
                    className={`menu-icon-link nav-parent ${activeSubNavs.has(item.title) ? 'expanded' : ''}`}
                  >
                    <span>{item.title}</span>
                    <span className="expand-icon material-symbols-outlined">
                      keyboard_arrow_right
                    </span>
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </a>
                  <div 
                    className={`sub-nav ${activeSubNavs.has(item.title) ? 'expanded' : ''}`}
                    id={item.title.toLowerCase()}
                  >
                    {item.subItems?.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className="sub-nav-item"
                      >
                        <span>{subItem.title}</span>
                        <span className="material-symbols-outlined">{subItem.icon}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
          
          <button
            onClick={toggleMenu}
            className="nav-circle main"
          ></button>
        </div>
      </div>
    </div>
  )
}