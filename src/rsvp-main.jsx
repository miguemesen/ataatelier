import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RsvpPage from './RsvpPage.jsx'
import './styles/rsvp.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RsvpPage />
  </StrictMode>
)
