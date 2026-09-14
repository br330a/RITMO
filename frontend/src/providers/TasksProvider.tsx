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
          completed: false,
        },
      ].sort((firstTask, secondTask) =>
        firstTask.time.localeCompare(secondTask.time),
      ),
    )
  }

  function updateTask(taskId: string, taskData: CreateTaskData) {
    setTasks((currentTasks) =>
      currentTasks
        .map((task) =>
          task.id === taskId
            ? { ...task, ...taskData }
            : task,
        )
        .sort((firstTask, secondTask) => {
          const dateComparison = firstTask.dueDate.localeCompare(
            secondTask.dueDate,
          )

          return dateComparison !== 0
            ? dateComparison
            : firstTask.time.localeCompare(secondTask.time)
        }),
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

  function deleteTask(taskId: string) {
  setTasks((currentTasks) =>
    currentTasks.filter((task) => task.id !== taskId),
  )
}

  const contextValue: TasksContextValue = {
    tasks,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
  }

  return (
    <TasksContext.Provider value={contextValue}>
      {children}
    </TasksContext.Provider>
  )
}