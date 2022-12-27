import { Button, Divider, Typography } from '@mui/material'
import { GetServerSideProps } from 'next'
import Tags from '../../components/tags'
import Layout from '../../layout'
import propsWrapper from '../../utils/ssr'
import { Article, BlogPageProps } from '../../utils/types'
import { Comment, ArticleText } from '../../utils/types'
import Comments from '../../components/comments'
import { useState } from 'react'
import NewComment from '../../components/newcomment'
import { TrustedMarkdown } from '../../components/markdown'
import { adminDb, ssGetDocSnap } from '../../utils/admin'
import router from 'next/router'

type ArticlePageProps = BlogPageProps & {
    docs: (Article | ArticleText | Comment)[]
}

const ArticlePage = ({ docs, settings }: ArticlePageProps) => {
    const { md } = docs.find(doc => doc.hasOwnProperty('md') && !doc.hasOwnProperty('user')) as ArticleText
    const { title, tags, time, id, cover } = docs.find(doc => doc.hasOwnProperty('title')) as Article
    const comments = docs.filter(doc => doc.hasOwnProperty('md') && doc.hasOwnProperty('user')) as Comment[]
    const [userComments, setUserComments] = useState<Comment[]>([])
    const redirectToEdit = () => {
        const url = window.location.href.split('/')
        url.splice(3, 0, 'console')
        router.push(url.join('/'))
    }
    return (
        <Layout title={title} cover={cover} {...settings}>
            <Typography variant='h3'>
                {title}
            </Typography>
            <Typography>
                {new Date(time).toLocaleDateString()}
            </Typography>
            <Tags tags={tags}></Tags>
            <br></br><br></br>
            <Divider sx={{ boxShadow: '3px 3px 3px black' }}></Divider>
            <TrustedMarkdown>
                {md}
            </TrustedMarkdown>
            <Divider sx={{ boxShadow: '3px 3px 3px black' }}></Divider>
            <br></br>
            <Button onClick={redirectToEdit} fullWidth variant='outlined'>本页 Markdown 源码</Button>
            <br></br><br></br>
            <Divider sx={{ boxShadow: '3px 3px 3px black' }}></Divider>
            <br></br>
            <NewComment articleId={id} setUserComments={setUserComments}></NewComment>
            <br></br><br></br>
            <Comments comments={comments.concat(userComments)}></Comments>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
    const id = ctx.query.id as string
    const commentsSnapPromise = adminDb.collection('comments').where('article', '==', id).orderBy('time').get()
    return await propsWrapper({
        docSnapPromises: [ssGetDocSnap('articles', id), ssGetDocSnap('texts', id)],
        querySnapPromises: [commentsSnapPromise],
        ignoreQueryDocsNotFound: true
    })
}

export default ArticlePage
