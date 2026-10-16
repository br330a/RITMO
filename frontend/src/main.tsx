import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './providers/AuthProvider'
import { CategoriesProvider } from './providers/CategoriesProvider'
import { TasksProvider } from './providers/TasksProvider'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <CategoriesProvider>
        <TasksProvider>
          <App />
        </TasksProvider>
      </CategoriesProvider>
    </AuthProvider>
  </BrowserRouter>,
)