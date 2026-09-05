import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { VersionProvider } from './context/VersionContext'
import { BookingProvider } from './context/BookingContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <VersionProvider>
        <BookingProvider>
          <App />
        </BookingProvider>
      </VersionProvider>
    </BrowserRouter>
  </StrictMode>,
)
