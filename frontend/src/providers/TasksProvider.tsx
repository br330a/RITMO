import {
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import { toast } from 'sonner'
import {
  TasksContext,
  type TasksContextValue,
} from '../context/tasksContext'
import { useAuth } from '../hooks/useAuth'
import { ApiError } from '../services/apiClient'
import {
  completeTaskOccurrenceRequest,
  createTaskRequest,
  deleteTaskRequest,
  getTasks,
  setTaskCompletionRequest,
  uncompleteTaskOccurrenceRequest,
  updateTaskRequest,
} from '../services/taskService'
import type {
  CreateTaskData,
  Task,
} from '../types/taskTypes'

type TasksState = {
  ownerToken: string | null
  tasks: Task[]
}

function sortTasks(tasks: Task[]) {
  return [...tasks].sort(
    (firstTask, secondTask) => {
      const dateComparison =
        firstTask.dueDate.localeCompare(
          secondTask.dueDate,
        )

      if (dateComparison !== 0) {
        return dateComparison
      }

      return (
        firstTask.time ?? '23:59'
      ).localeCompare(
        secondTask.time ?? '23:59',
      )
    },
  )
}

function getErrorMessage(
  error: unknown,
  fallbackMessage: string,
) {
  if (error instanceof ApiError) {
    return (
      error.payload?.message ??
      fallbackMessage
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}

export function TasksProvider({
  children,
}: PropsWithChildren) {
  const { token } = useAuth()

  const [state, setState] =
    useState<TasksState>({
      ownerToken: null,
      tasks: [],
    })

  // Bloqueia toques repetidos na mesma tarefa até a API responder.
  const pendingTaskIds = useRef(new Set<string>())

  const tasks =
    token && state.ownerToken === token
      ? state.tasks
      : []

  const isLoadingTasks =
    Boolean(token) &&
    state.ownerToken !== token

  useEffect(() => {
    if (!token) {
      return
    }

    let isActive = true

    getTasks(token)
      .then((loadedTasks) => {
        if (!isActive) {
          return
        }

        setState({
          ownerToken: token,
          tasks: sortTasks(loadedTasks),
        })
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return
        }

        setState({
          ownerToken: token,
          tasks: [],
        })

        toast.error(
          getErrorMessage(
            error,
            'Não foi possível carregar as tarefas.',
          ),
        )
      })

    return () => {
      isActive = false
    }
  }, [token])

  async function createTask(
    taskData: CreateTaskData,
  ) {
    if (!token) {
      toast.error(
        'Sua sessão não está disponível.',
      )

      return false
    }

    try {
      const newTask =
        await createTaskRequest(
          token,
          taskData,
        )

      setState((currentState) => ({
        ownerToken: token,
        tasks: sortTasks(
          currentState.ownerToken === token
            ? [
                ...currentState.tasks,
                newTask,
              ]
            : [newTask],
        ),
      }))

      toast.success(
        'Tarefa criada com sucesso.',
      )

      return true
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          'Não foi possível criar a tarefa.',
        ),
      )

      return false
    }
  }

  async function updateTask(
    taskId: string,
    taskData: CreateTaskData,
  ) {
    if (!token) {
      toast.error(
        'Sua sessão não está disponível.',
      )

      return false
    }

    try {
      const updatedTask =
        await updateTaskRequest(
          token,
          taskId,
          taskData,
        )

      setState((currentState) => ({
        ownerToken: token,
        tasks:
          currentState.ownerToken === token
            ? sortTasks(
                currentState.tasks.map(
                  (task) =>
                    task.id === taskId
                      ? updatedTask
                      : task,
                ),
              )
            : [updatedTask],
      }))

      toast.success(
        'Tarefa atualizada com sucesso.',
      )

      return true
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          'Não foi possível atualizar a tarefa.',
        ),
      )

      return false
    }
  }

  async function toggleTask(
    taskId: string,
    occurrenceDate?: string,
  ) {
    if (!token) {
      toast.error('Sua sessão não está disponível.')
      return false
    }

    // Duplo clique não cria duas operações concorrentes para a mesma tarefa.
    if (pendingTaskIds.current.has(taskId)) {
      return false
    }

    const previousTask = tasks.find((task) => task.id === taskId)

    if (!previousTask) {
      toast.error('A tarefa não foi encontrada.')
      return false
    }

    const targetDate = occurrenceDate ?? previousTask.dueDate
    const wasCompleted = previousTask.recurrence
      ? Boolean(previousTask.completedOccurrences[targetDate])
      : previousTask.completed

    const now = new Date().toISOString()
    let optimisticTask: Task

    if (previousTask.recurrence) {
      const occurrences = { ...previousTask.completedOccurrences }

      if (wasCompleted) {
        delete occurrences[targetDate]
      } else {
        occurrences[targetDate] = now
      }

      optimisticTask = {
        ...previousTask,
        completedOccurrences: occurrences,
      }
    } else {
      optimisticTask = {
        ...previousTask,
        completed: !wasCompleted,
        completedAt: wasCompleted ? null : now,
      }
    }

    pendingTaskIds.current.add(taskId)

    // Mudança visual instantânea, sem aguardar a resposta do servidor.
    setState((currentState) => currentState.ownerToken === token
      ? {
          ...currentState,
          tasks: currentState.tasks.map((task) =>
            task.id === taskId ? optimisticTask : task,
          ),
        }
      : currentState,
    )

    try {
      const updatedTask = previousTask.recurrence
        ? wasCompleted
          ? await uncompleteTaskOccurrenceRequest(token, taskId, targetDate)
          : await completeTaskOccurrenceRequest(token, taskId, targetDate)
        : await setTaskCompletionRequest(token, taskId, !wasCompleted)

      setState((currentState) => currentState.ownerToken === token
        ? {
            ...currentState,
            tasks: currentState.tasks.map((task) =>
              task.id === taskId ? updatedTask : task,
            ),
          }
        : currentState,
      )

      return true
    } catch (error) {
      // Reverte apenas a tarefa afetada; outras mudanças são preservadas.
      setState((currentState) => currentState.ownerToken === token
        ? {
            ...currentState,
            tasks: currentState.tasks.map((task) =>
              task.id === taskId ? previousTask : task,
            ),
          }
        : currentState,
      )

      toast.error(getErrorMessage(
        error,
        'Não foi possível atualizar o status da tarefa.',
      ))
      return false
    } finally {
      pendingTaskIds.current.delete(taskId)
    }
  }

  async function deleteTask(
    taskId: string,
  ) {
    if (!token) {
      toast.error(
        'Sua sessão não está disponível.',
      )

      return false
    }

    try {
      await deleteTaskRequest(
        token,
        taskId,
      )

      setState((currentState) => ({
        ownerToken: token,
        tasks:
          currentState.ownerToken === token
            ? currentState.tasks.filter(
                (task) =>
                  task.id !== taskId,
              )
            : [],
      }))

      toast.success(
        'Tarefa excluída com sucesso.',
      )

      return true
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          'Não foi possível excluir a tarefa.',
        ),
      )

      return false
    }
  }

  const contextValue: TasksContextValue = {
    tasks,
    isLoadingTasks,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
  }

  return (
    <TasksContext.Provider
      value={contextValue}
    >
      {children}
    </TasksContext.Provider>
  )
}
