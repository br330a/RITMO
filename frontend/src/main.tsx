import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import './index.css'
import { TasksProvider } from './providers/TasksProvider'
import { CategoriesProvider } from './providers/CategoriesProvider'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <CategoriesProvider>
      <TasksProvider>
        <App />
      </TasksProvider>
    </CategoriesProvider>
  </BrowserRouter>
)