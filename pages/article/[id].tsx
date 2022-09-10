import { Divider, Typography } from '@mui/material'
import { GetServerSideProps } from 'next'
import Tags from '../../components/tags'
import Layout from '../../layout'
import getDocSnap, { db } from '../../utils/firebase'
import propsWrapper from '../../utils/ssr'
import { Article, BlogPageProps } from '../../utils/types'
import { Comment, ArticleText } from '../../utils/types'
import Comments from '../../components/comments'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { useState } from 'react'
import NewComment from '../../components/newcomment'
import { TrustedMarkdown } from '../../components/markdown'

type ArticlePageProps = BlogPageProps & {
    docs: (Article | ArticleText | Comment)[]
}

const ArticlePage = ({ docs, settings }: ArticlePageProps) => {
    const { md } = docs.find(doc => doc.hasOwnProperty('md') && !doc.hasOwnProperty('user')) as ArticleText
    const { title, tags, time, id, cover } = docs.find(doc => doc.hasOwnProperty('title')) as Article
    const comments = docs.filter(doc => doc.hasOwnProperty('md') && doc.hasOwnProperty('user')) as Comment[]
    const [userComments, setUserComments] = useState<Comment[]>([])
    return (
        <Layout title={title} cover={cover} {...settings}>
            <Typography variant='h2'>
                {title}
            </Typography>
            <Typography>
                {new Date(time.seconds * 1000).toLocaleDateString()}
            </Typography>
            <Tags tags={tags}></Tags>
            <TrustedMarkdown>
                {md}
            </TrustedMarkdown>
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
    const commentsSnapPromise = getDocs(query(collection(db, 'comments'), where('article', '==', id), orderBy('time')))
    return await propsWrapper({
        docSnapPromises: [getDocSnap('articles', id), getDocSnap('texts', id)],
        querySnapPromises: [commentsSnapPromise],
        ignoreQueryDocsNotFound: true
    })
}

export default ArticlePage
