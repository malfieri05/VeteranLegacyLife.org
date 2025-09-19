import React from 'react'
import ReactDOM from 'react-dom/client'
import { FunnelModal } from './components/FunnelModal'
import { useFunnelStore } from './store/funnelStore'
import './styles/globals.css'

// Declare global interface
declare global {
  interface Window {
    VeteranFunnel: any
  }
}

// Create a container for the React app
const createFunnelContainer = () => {
  const container = document.createElement('div')
  container.className = 'veteran-funnel'
  container.id = 'veteran-funnel-container'
  document.body.appendChild(container)
  return container
}

// Initialize the funnel
const initializeFunnel = () => {
  const container = createFunnelContainer()
  const root = ReactDOM.createRoot(container)
  
  root.render(
    <React.StrictMode>
      <FunnelModal />
    </React.StrictMode>
  )
  
  return root
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFunnel)
} else {
  // If DOM is already loaded, wait a bit to ensure everything is ready
  setTimeout(initializeFunnel, 100)
}

// Force Vercel to pick up latest changes
console.log('VeteranFunnel initialized - latest version')

// Create and expose the global API
const VeteranFunnel = {
  open: () => {
    // Use the store directly without hooks
    const store = useFunnelStore.getState()
    store.openModal()
  },
  
  close: () => {
    // Use the store directly without hooks
    const store = useFunnelStore.getState()
    store.closeModal()
  },
  
  isOpen: () => {
    // Use the store directly without hooks
    const store = useFunnelStore.getState()
    return store.isModalOpen
  },
  
  reset: () => {
    // Use the store directly without hooks
    const store = useFunnelStore.getState()
    store.resetFunnel()
  }
}

// Expose to global scope
if (typeof window !== 'undefined') {
  window.VeteranFunnel = VeteranFunnel
}

// Export for module systems
export { VeteranFunnel } 

// In local development, auto-open the funnel so the page isn't blank
// and you can iterate faster. This does NOT run in production builds.
if (import.meta && (import.meta as any).env && (import.meta as any).env.DEV) {
  setTimeout(() => {
    try {
      window.VeteranFunnel?.open()
    } catch {}
  }, 150)
}