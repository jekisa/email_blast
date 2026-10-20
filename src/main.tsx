import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LoginPage from './LoginPage.tsx'

const page = window.location.pathname === '/login' ? <LoginPage /> : <App />
document.title = window.location.pathname === '/login'
  ? 'Login Admin - Birthday Automation'
  : 'Birthday Studio - Sanghyang Indah'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {page}
  </StrictMode>,
)
