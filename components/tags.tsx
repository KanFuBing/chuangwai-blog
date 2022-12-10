import { Chip } from '@mui/material'
import router from 'next/router'

type TagsProps = {
    tags: string[]
}

const Tags = ({ tags }: TagsProps) => (
    <>
        {
            tags.filter(tag => tag !== '').map((tag) => (
                <Chip
                    onClick={e => {
                        e.stopPropagation()
                        router.push(`/tag/${tag}`)
                    }}
                    label={`${tag}`}
                    key={tag}
                    sx={{ mr: 1 }}
                ></Chip>
            ))
        }
    </>
)

export default Tags
