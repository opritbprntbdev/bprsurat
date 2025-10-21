import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import './index.css'
import { ToastProvider } from './components/ui/ToastProvider.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

const client = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)