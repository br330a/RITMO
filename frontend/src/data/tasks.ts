import type { Task } from '../types/task'
import { getLocalDateValue } from '../utils/date'

const today = getLocalDateValue()

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Revisar anotações da aula',
    dueDate: today,
    time: '08:00',
    category: 'Faculdade',
    completed: true,
  },
  {
    id: 'task-2',
    title: 'Ir para a academia',
    dueDate: today,
    time: '09:30',
    category: 'Saúde',
    completed: true,
  },
  {
    id: 'task-3',
    title: 'Estudar Java',
    dueDate: today,
    time: '11:00',
    category: 'Faculdade',
    completed: false,
  },
  {
    id: 'task-4',
    title: 'Organizar o quarto',
    dueDate: today,
    time: '14:00',
    category: 'Pessoal',
    completed: false,
  },
  {
    id: 'task-5',
    title: 'Planejar as tarefas de amanhã',
    dueDate: today,
    time: '19:00',
    category: 'Pessoal',
    completed: false,
  },
]