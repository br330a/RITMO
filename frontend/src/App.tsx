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
        duration={3500}
        visibleToasts={3}
        toastOptions={{ className: 'ritmo-toast' }}
        swipeDirections={['top']}
      />
    </>
  )
}

export default App