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
      { title: 'Create Project', icon: 'add_circle', href: '/dashboard/projects/new' },
      { title: 'Active Projects', icon: 'trending_up', href: '/dashboard/projects?status=active' },
      { title: 'Completed Projects', icon: 'task_alt', href: '/dashboard/projects?status=completed' },
      { title: 'On Hold', icon: 'pause_circle', href: '/dashboard/projects?status=on_hold' },
    ],
  },
]

type ModalView = 'menu' | 'appearance'
type Theme = 'dark' | 'light' | 'system'

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeSubNavs, setActiveSubNavs] = useState<Set<string>>(new Set())
  const [showUserModal, setShowUserModal] = useState(false)
  const [modalView, setModalView] = useState<ModalView>('menu')
  const [theme, setTheme] = useState<Theme>('dark')
  const router = useRouter()

  // Load sidebar state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarExpanded')
    if (savedState !== null) {
      const expanded = JSON.parse(savedState)
      setIsExpanded(expanded)
    }
  }, [])

  // Load and apply theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      applyTheme('dark')
    }
  }, [])

  const applyTheme = (selectedTheme: Theme) => {
    const root = document.documentElement
    
    if (selectedTheme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light')
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        if (theme === 'system') {
          root.setAttribute('data-theme', e.matches ? 'dark' : 'light')
        }
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      root.setAttribute('data-theme', selectedTheme)
    }
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

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
    <>
      {/* User Modal Overlay */}
      {showUserModal && (
        <>
          <div 
            className="modal-backdrop"
            onClick={() => setShowUserModal(false)}
          />
          <div className="user-modal">
            <div className="user-modal-header">
              <div className="modal-header-left">
                {modalView !== 'menu' && (
                  <button 
                    className="modal-back"
                    onClick={() => setModalView('menu')}
                  >
                    <span className="material-symbols-outlined">arrow_back</span>
                  </button>
                )}
                <h2>{modalView === 'menu' ? 'User Settings' : 'Appearance'}</h2>
              </div>
              <button 
                className="modal-close"
                onClick={() => setShowUserModal(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="user-modal-content">
              {modalView === 'menu' ? (
                <>
                  <div className="user-profile-section">
                    <div className="user-avatar">
                      <span className="material-symbols-outlined">account_circle</span>
                    </div>
                    <div className="user-info">
                      <h3>John Doe</h3>
                      <p>john.doe@example.com</p>
                    </div>
                  </div>
                  <div className="user-menu-section">
                    <button className="user-menu-item">
                      <span className="material-symbols-outlined">manage_accounts</span>
                      <span>Edit Profile</span>
                    </button>
                    <button className="user-menu-item">
                      <span className="material-symbols-outlined">notifications</span>
                      <span>Notifications</span>
                    </button>
                    <button className="user-menu-item">
                      <span className="material-symbols-outlined">security</span>
                      <span>Security Settings</span>
                    </button>
                    <button 
                      className="user-menu-item"
                      onClick={() => setModalView('appearance')}
                    >
                      <span className="material-symbols-outlined">palette</span>
                      <span>Appearance</span>
                    </button>
                    <button className="user-menu-item">
                      <span className="material-symbols-outlined">language</span>
                      <span>Language & Region</span>
                    </button>
                    <button className="user-menu-item">
                      <span className="material-symbols-outlined">help</span>
                      <span>Help & Support</span>
                    </button>
                    <div className="user-menu-divider"></div>
                    <button className="user-menu-item logout">
                      <span className="material-symbols-outlined">logout</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="appearance-settings">
                  <div className="settings-section">
                    <h3>Theme</h3>
                    <div className="theme-options">
                      <button 
                        className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                        onClick={() => handleThemeChange('dark')}
                      >
                        <span className="material-symbols-outlined">dark_mode</span>
                        <span>Dark</span>
                      </button>
                      <button 
                        className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                        onClick={() => handleThemeChange('light')}
                      >
                        <span className="material-symbols-outlined">light_mode</span>
                        <span>Light</span>
                      </button>
                      <button 
                        className={`theme-option ${theme === 'system' ? 'active' : ''}`}
                        onClick={() => handleThemeChange('system')}
                      >
                        <span className="material-symbols-outlined">computer</span>
                        <span>System</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="settings-section">
                    <h3>Accent Color</h3>
                    <div className="color-options">
                      <button className="color-option" style={{background: '#007AFF'}}></button>
                      <button className="color-option" style={{background: '#34C759'}}></button>
                      <button className="color-option" style={{background: '#FF3B30'}}></button>
                      <button className="color-option" style={{background: '#FF9500'}}></button>
                      <button className="color-option" style={{background: '#AF52DE'}}></button>
                      <button className="color-option" style={{background: '#FFCC00'}}></button>
                      <button className="color-option active" style={{background: '#FF6B6B'}}></button>
                      <button className="color-option" style={{background: '#4ECDC4'}}></button>
                    </div>
                  </div>
                  
                  <div className="settings-section">
                    <h3>Display</h3>
                    <div className="display-settings">
                      <div className="setting-item">
                        <span>Compact Mode</span>
                        <label className="toggle-switch">
                          <input type="checkbox" />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                      <div className="setting-item">
                        <span>Show Animations</span>
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                      <div className="setting-item">
                        <span>High Contrast</span>
                        <label className="toggle-switch">
                          <input type="checkbox" />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="settings-section">
                    <h3>Font Size</h3>
                    <div className="font-size-selector">
                      <button className="font-size-option">A-</button>
                      <button className="font-size-option active">A</button>
                      <button className="font-size-option">A+</button>
                    </div>
                  </div>
                  
                  <div className="settings-section">
                    <h3>Sidebar</h3>
                    <div className="display-settings">
                      <div className="setting-item">
                        <span>Auto-collapse on mobile</span>
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                      <div className="setting-item">
                        <span>Show icon labels</span>
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="settings-actions">
                    <button className="btn-reset">Reset to Defaults</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
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
            <button 
              className="header-icon"
              onClick={() => {
                setShowUserModal(true)
                setModalView('menu')
              }}
            >
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
    </>
  )
}