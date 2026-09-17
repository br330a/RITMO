import type { Task } from '../types/taskTypes'
import { getLocalDateValue } from '../utils/date'

const today = getLocalDateValue()

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Revisar anotações da aula',
    description: null,
    dueDate: today,
    time: '08:00',
    category: 'Faculdade',
    priority: 'medium',
    estimatedMinutes: 30,
    completed: true,
  },
  {
    id: 'task-2',
    title: 'Ir para a academia',
    description: null,
    dueDate: today,
    time: '09:30',
    category: 'Saúde',
    priority: 'medium',
    estimatedMinutes: 60,
    completed: true,
  },
  {
    id: 'task-3',
    title: 'Estudar Java',
    description: null,
    dueDate: today,
    time: '11:00',
    category: 'Faculdade',
    priority: 'high',
    estimatedMinutes: 60,
    completed: false,
  },
  {
    id: 'task-4',
    title: 'Organizar o quarto',
    description: null,
    dueDate: today,
    time: '14:00',
    category: 'Pessoal',
    priority: 'low',
    estimatedMinutes: 30,
    completed: false,
  },
  {
    id: 'task-5',
    title: 'Planejar as tarefas de amanhã',
    description: null,
    dueDate: today,
    time: '19:00',
    category: 'Pessoal',
    priority: 'medium',
    estimatedMinutes: 20,
    completed: false,
  },
]