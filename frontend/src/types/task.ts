export type TaskCategory = 'Faculdade' | 'Pessoal' | 'Saúde'

export type Task = {
  id: number
  title: string
  time: string
  category: TaskCategory
  completed: boolean
}