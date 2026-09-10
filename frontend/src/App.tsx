import { CheckCircle2 } from 'lucide-react'

function App() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7faf7] px-6">
      <section className="text-center">
        <CheckCircle2
          className="mx-auto mb-4 text-[#23834b]"
          size={48}
          strokeWidth={1.8}
        />

        <h1 className="text-4xl font-bold tracking-tight text-[#17211b]">
          RITMO
        </h1>

        <p className="mt-3 text-[#667069]">
          Organize suas tarefas. Encontre o seu ritmo.
        </p>
      </section>
    </main>
  )
}

export default App