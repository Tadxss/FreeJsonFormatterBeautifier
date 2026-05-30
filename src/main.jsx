import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import JsonFormatter from './components/JsonFormatter'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <JsonFormatter />
  </StrictMode>,
)
