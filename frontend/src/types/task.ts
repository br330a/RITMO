export type TaskCategory = 'Faculdade' | 'Pessoal' | 'Saúde'

export type Task = {
  id: string
  title: string
  dueDate: string
  time: string
  category: TaskCategory
  completed: boolean
}

export type CreateTaskData = Pick<Task, 'title' | 'time' | 'category'>