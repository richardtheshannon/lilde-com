'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/header'
import Sidebar from '@/components/layout/sidebar'
import Footer from '@/components/layout/footer'

export default function Home() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)

  useEffect(() => {
    const handleSidebarToggle = () => {
      const sidebar = document.querySelector('.main-menu-sidebar')
      if (sidebar) {
        const isExpanded = sidebar.classList.contains('expanded')
        setIsSidebarExpanded(isExpanded)
      }
    }

    // Check initial state
    handleSidebarToggle()

    // Listen for changes (we'll need to add a custom event)
    const sidebar = document.querySelector('.main-menu-sidebar')
    if (sidebar) {
      const observer = new MutationObserver(handleSidebarToggle)
      observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] })
      return () => observer.disconnect()
    }
  }, [])

  return (
    <div className="min-h-screen">
      <Header />
      <Sidebar />
      
      <main className={`content ${isSidebarExpanded ? 'menu-expanded' : ''}`}>
        <div className="safe-margin">
          <div className="grid grid-cols-3 gap-6 items-start" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'start' }}>
            {/* Left Column - 1/3 */}
            <div className="main-content-left">
              <p style={{ textAlign: 'right' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              
              <p style={{ textAlign: 'right', marginTop: '1rem' }}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              
              <p style={{ textAlign: 'right', marginTop: '1rem' }}>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
              
              <p style={{ textAlign: 'right', marginTop: '1rem' }}>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.</p>
              
              <p style={{ textAlign: 'right', marginTop: '1rem' }}>Consectetur adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.</p>
              
              <p style={{ textAlign: 'right', marginTop: '1rem' }}>Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.</p>
              
              <p style={{ textAlign: 'right', marginTop: '1rem' }}>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
              
              <p style={{ textAlign: 'right', marginTop: '1rem' }}>Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque.</p>
              
              <p style={{ textAlign: 'right', marginTop: '1rem' }}>Nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet.</p>
              
              <p style={{ textAlign: 'right', marginTop: '1rem' }}>Ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>
            </div>

            {/* Right Column - 2/3 */}
            <div className="main-content-right">
              <p style={{ textAlign: 'left' }}>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
              
              <p style={{ textAlign: 'left', marginTop: '1rem' }}>Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.</p>
              
              <p style={{ textAlign: 'left', marginTop: '1rem' }}>Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.</p>
              
              <p style={{ textAlign: 'left', marginTop: '1rem' }}>Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              
              <p style={{ textAlign: 'left', marginTop: '1rem' }}>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
              
              <p style={{ textAlign: 'left', marginTop: '1rem' }}>Sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
//