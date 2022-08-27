import { Box, Button, TextField } from '@mui/material'
import { Timestamp } from 'firebase/firestore'
import { GetServerSideProps } from 'next'
import router from 'next/router'
import { ChangeEvent, useState } from 'react'
import Popup from '../../../components/popup'
import Recheck from '../../../components/recheck'
import Layout from '../../../layout'
import getDocSnap, { deleteFbDoc, setFbDoc, updateFbDoc } from '../../../utils/firebase'
import propsWrapper from '../../../utils/ssr'
import { BlogPageProps, Article, ArticleText } from '../../../utils/types'

type ArticleEditPageProps = BlogPageProps & {
    docs: (Article | ArticleText)[]
}

const ArticleEditPage = ({ docs, settings }: ArticleEditPageProps) => {
    const [articleText, setArticleText] = useState((docs.find(doc => doc.hasOwnProperty('md') && !doc.hasOwnProperty('user')) as ArticleText)?.md)
    const articleDoc: {
        id: string
        time: Timestamp | { seconds: number }
        title: string
        tags: string | string[]
        cover: string
    } = docs.find(doc => doc.hasOwnProperty('title')) as Article
    if (typeof articleDoc.tags !== 'string') {
        articleDoc.tags = articleDoc.tags.join(' ')
    }
    const [article, setArticle] = useState(articleDoc)

    const [isOpen, setOpen] = useState(false)
    const [isSuccessful, setIsSuccessful] = useState(false)

    const handleArticleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
        setArticle(article => ({ ...article, [key]: event.target.value }))
    }
    const publishArticle = () => {
        const changedArticle: {
            id?: string
            time?: Timestamp | { seconds: number }
            title: string
            tags: string | string[]
            cover: string
        } = Object.assign({}, article) // 浅拷贝
        delete changedArticle.id, changedArticle.time;
        // 无需也不能更新 ID 和时间戳
        changedArticle.tags = (changedArticle.tags as string).split(' ')
        // 用空格分割多个标签
        updateFbDoc('articles', article.id, changedArticle)
            .then(() => {
                setOpen(true)
                setIsSuccessful(true)
            })
            .catch(() => {
                setOpen(true)
                setIsSuccessful(false)
            })
    }

    const handleArticleTextChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setArticleText(event.target.value)
    }
    const publishArticleText = () => {
        setFbDoc('texts', article.id, { md: articleText })
            .then(() => {
                setOpen(true)
                setIsSuccessful(true)
            })
            .catch(() => {
                setOpen(true)
                setIsSuccessful(false)
            })
    }

    const [isRechecking, setIsRechecking] = useState(false)
    const deleteArticle = async () => {
        await Promise.all([deleteFbDoc('articles', article.id), deleteFbDoc('texts', article.id)])
        router.push('/console')
    }

    const BorderStyle = {
        p: 2,
        borderStyle: 'solid',
        borderWidth: 2,
        borderImage: 'linear-gradient(to right, #9958e4, #527aca) 1'
    }
    return (
        <Layout title={article.title} {...settings}>
            <Box sx={BorderStyle}>
                {
                    Object.keys(article).map(key => (
                        <Box key={key}>
                            <TextField
                                required
                                fullWidth
                                disabled={key === 'id' || key === 'time'}
                                label={key}
                                onChange={e => handleArticleChange(e, key)}
                                value={article[key]}
                            />
                            <br></br><br></br>
                        </Box>
                    ))
                }
                <Button onClick={publishArticle}>
                    发布
                </Button>
            </Box>
            <br></br><br></br>

            <Box sx={BorderStyle}>
                <TextField
                    required
                    fullWidth
                    multiline
                    label='md'
                    rows={5}
                    onChange={handleArticleTextChange}
                    value={articleText}
                />
                <br></br><br></br>
                <Button onClick={publishArticleText}>
                    发布
                </Button>
            </Box>

            <br></br><br></br>
            <Button onClick={() => { setIsRechecking(true) }} color='error' variant='outlined'>
                删除
            </Button>

            <Popup isOpen={isOpen} isSuccessful={isSuccessful} setOpen={setOpen}></Popup>
            <Recheck isRechecking={isRechecking} setIsRechecking={setIsRechecking} operate={deleteArticle}></Recheck>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
    const id = ctx.query.id as string
    return await propsWrapper({
        docSnapPromises: [getDocSnap('articles', id), getDocSnap('texts', id)],
        ignoreDocNotFound: true
    })
}

export default ArticleEditPage
