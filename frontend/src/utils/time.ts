// Normaliza tanto horários completos quanto abreviações (19 -> 19:00; 730 -> 07:30).
// Retorna null para valores inválidos, e string vazia quando o campo está vazio.
export function normalizeTime(value: string): string | null {
  const trimmed = value.trim()

  if (!trimmed) return ''
  if (!/^(\d{1,2}(:\d{1,2})?|\d{3,4})$/.test(trimmed)) return null

  let hour: number
  let minute = 0

  if (trimmed.includes(':')) {
    const [hourPart, minutePart] = trimmed.split(':')
    hour = Number(hourPart)
    minute = Number(minutePart)
  } else if (trimmed.length <= 2) {
    hour = Number(trimmed)
  } else if (trimmed.length === 3) {
    hour = Number(trimmed.slice(0, 1))
    minute = Number(trimmed.slice(1))
  } else {
    hour = Number(trimmed.slice(0, 2))
    minute = Number(trimmed.slice(2))
  }

  if (hour > 23 || minute > 59) return null

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

// Insere ':' enquanto o usuário digita, sem exigir quatro números.
export function formatWhileTyping(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4)

  if (digits.length < 3) return digits

  // Ex.: 730 -> 7:30. Com quatro números: 1930 -> 19:30.
  if (digits.length === 3 && Number(digits.slice(0, 2)) > 23) {
    return `${digits[0]}:${digits.slice(1)}`
  }

  return `${digits.slice(0, 2)}:${digits.slice(2)}`
}

