const legacyCategoryIds: Record<
    string,
    string
> = {
    Faculdade: 'faculdade',
    Pessoal: 'pessoal',
    Saúde: 'saude',
}

export function getLegacyCategoryId(
    category: string,
) {
    return (
        legacyCategoryIds[category] ??
        category
            .trim()
            .toLocaleLowerCase('pt-BR')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
    )
}