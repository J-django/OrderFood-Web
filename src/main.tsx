import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initializeApiClient } from '@/api'
import App from '@/App'
import { registerPlugins } from '@/plugin'

function bootstrap() {
  initializeApiClient()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      {registerPlugins(<App />)}
    </StrictMode>,
  )
}

bootstrap()
