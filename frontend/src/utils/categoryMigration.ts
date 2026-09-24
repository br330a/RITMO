const legacyCategoryIds: Record<
  string,
  string
> = {
  Faculdade: 'faculdade',
  Pessoal: 'pessoal',
  Saúde: 'saude',
}

export function getLegacyCategoryId(
  legacyCategoryName: string,
) {
  return (
    legacyCategoryIds[
      legacyCategoryName
    ] ??
    legacyCategoryName
      .trim()
      .toLocaleLowerCase('pt-BR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
  )
}