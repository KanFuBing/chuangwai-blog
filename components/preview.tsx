import { Card, CardActionArea, CardContent, Typography, CardMedia, Chip } from '@mui/material'
import router from 'next/router'
import { Article } from '../utils/types'
import Tags from './tags'

const ArticlePreview = ({ ...article }: Article) => {
    const redirect = () => {
        router.push(`/article/${article.id}`)
    }
    return (
        <Card raised elevation={20} sx={{
            mb: 5,
        }}>
            <CardActionArea sx={{ height: '100%' }} onClick={redirect}>
                <CardContent>
                    <Typography variant='h4'>
                        {article.title}
                    </Typography>
                    <Typography variant='body2'>
                        {new Date(article.time).toLocaleDateString()}
                    </Typography>
                    <Tags tags={article.tags}></Tags>
                </CardContent>
                {
                    article.cover.length > 0
                    &&
                    <CardMedia
                        component='img'
                        alt={article.title}
                        image={article.cover}
                    />
                }
            </CardActionArea>
        </Card>
    )
}

export default ArticlePreview
