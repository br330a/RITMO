import {
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react'
import {
  TasksContext,
  type TasksContextValue,
} from '../context/tasksContext'
import { initialTasks } from '../data/tasks'
import { loadTasks, saveTasks } from '../services/taskStorage'
import type { CreateTaskData, Task } from '../types/task'
import { getLocalDateValue } from '../utils/date'

export function TasksProvider({ children }: PropsWithChildren) {
  const [tasks, setTasks] = useState<Task[]>(
    () => loadTasks() ?? initialTasks,
  )

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  function createTask(taskData: CreateTaskData) {
    setTasks((currentTasks) =>
      [
        ...currentTasks,
        {
          ...taskData,
          id: crypto.randomUUID(),
          dueDate: getLocalDateValue(),
          completed: false,
        },
      ].sort((firstTask, secondTask) =>
        firstTask.time.localeCompare(secondTask.time),
      ),
    )
  }

  function toggleTask(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task,
      ),
    )
  }

  const contextValue: TasksContextValue = {
    tasks,
    createTask,
    toggleTask,
  }

  return (
    <TasksContext.Provider value={contextValue}>
      {children}
    </TasksContext.Provider>
  )
}