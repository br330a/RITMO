import { AppRoutes } from './routes/AppRoutes'
import { Toaster } from 'sonner'

function App() {
  return (
    <>
      <AppRoutes />

      <Toaster
        position="top-right"
        richColors
        closeButton={false}
        swipeDirections={['top']}
      />
    </>
  )
}

export default App