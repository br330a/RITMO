export type CategoryColor =
    | 'green'
    | 'blue'
    | 'purple'
    | 'orange'
    | 'red'
    | 'teal'

export type CategoryIcon =
    | 'graduation'
    | 'user'
    | 'health'
    | 'work'
    | 'finance'
    | 'study'
    | 'home'
    | 'other'

export type Category = {
    id: string
    name: string
    color: CategoryColor
    icon: CategoryIcon
}

export type CreateCategoryData = Omit<
    Category,
    'id'
>