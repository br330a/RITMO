import type { Task } from '../types/task'

export const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Revisar anotações da aula',
    time: '08:00',
    category: 'Faculdade',
    completed: true,
  },
  {
    id: 2,
    title: 'Ir para a academia',
    time: '09:30',
    category: 'Saúde',
    completed: true,
  },
  {
    id: 3,
    title: 'Estudar Java',
    time: '11:00',
    category: 'Faculdade',
    completed: false,
  },
  {
    id: 4,
    title: 'Organizar o quarto',
    time: '14:00',
    category: 'Pessoal',
    completed: false,
  },
  {
    id: 5,
    title: 'Planejar as tarefas de amanhã',
    time: '19:00',
    category: 'Pessoal',
    completed: false,
  },
]