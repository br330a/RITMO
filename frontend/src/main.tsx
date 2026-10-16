import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './providers/AuthProvider'
import { CategoriesProvider } from './providers/CategoriesProvider'
import { TasksProvider } from './providers/TasksProvider'
import { ThemeProvider } from './providers/ThemeProvider'

createRoot(
  document.getElementById('root')!,
).render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <CategoriesProvider>
          <TasksProvider>
            <App />
          </TasksProvider>
        </CategoriesProvider>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>,
)