import { Plus } from 'lucide-react'

export function DashboardPage() {
  const currentDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  return (
    <section>
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[#17211b]">
            Bom dia, Bruno!
          </h1>

          <p className="mt-2 text-lg text-[#667069]">
            Vamos organizar o seu dia?
          </p>

          <p className="mt-3 capitalize text-sm text-[#8a938d]">
            {currentDate}
          </p>
        </div>

        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#23834b] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#19683a]"
        >
          <Plus size={19} />
          Nova tarefa
        </button>
      </header>

      <div className="mt-10 rounded-2xl border border-[#e4ebe5] bg-white p-7 shadow-sm">
        <h2 className="text-xl font-semibold text-[#17211b]">
          Suas tarefas de hoje
        </h2>

        <p className="mt-2 text-sm text-[#7b847e]">
          Em breve, suas tarefas aparecerão aqui.
        </p>
      </div>
    </section>
  )
}