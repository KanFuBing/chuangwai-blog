export type Settings = {
    name: string
    profile: string
    bg: string
    tags: string
}

export type BlogPageProps = {
    settings: Settings
}

export type Article = {
    id: string
    time: number
    title: string
    tags: string[]
    cover: string
}

export type ArticleText = {
    id: string
    md: string
}

export type Comment = {
    id: string
    user: string
    uid: string
    time: number
    md: string
    article: string
}
