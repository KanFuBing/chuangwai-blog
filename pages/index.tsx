import { IconButton, Box } from '@mui/material'
import { collection, getDocs, limit, orderBy, query, startAfter, QueryDocumentSnapshot } from 'firebase/firestore'
import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'
import ArticlePreview from '../components/preview'
import Layout from '../layout'
import { db, getQuerySnapDocsData } from '../utils/firebase'
import propsWrapper from '../utils/ssr'
import { BlogPageProps, Article } from '../utils/types'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

type HomePageProps = BlogPageProps & {
  docs: Article[]
}

const ARTICLES_PER_LOAD = 5

const HomePage = ({ docs, settings }: HomePageProps) => {
  const [articles, setArticles] = useState<Article[]>(docs)
  const [loadButtonStatus, setLoadButtonStatus] = useState('')
  const [cursor, setCursor] = useState<QueryDocumentSnapshot>()

  useEffect(() => {
    // 初始化游标
    const q = query(collection(db, 'articles'), orderBy('time', 'desc'), limit(1))
    getDocs(q).then(querySnap => {
      setCursor(querySnap.docs[0])
    })
  }, [])

  const loadMore = async () => {
    if (cursor) {
      setLoadButtonStatus('disabled')
      const loadQ = query(collection(db, 'articles'), orderBy('time', 'desc'), startAfter(cursor), limit(ARTICLES_PER_LOAD))
      const loadingArticlesSnap = await getDocs(loadQ)
      const loadingArticles = getQuerySnapDocsData(loadingArticlesSnap)
      setArticles(articles => articles.concat(loadingArticles as Article[]))
      setCursor(loadingArticlesSnap.docs[loadingArticlesSnap.docs.length - 1])
      setLoadButtonStatus('')
      if (loadingArticles.length < ARTICLES_PER_LOAD) {
        setLoadButtonStatus('hidden')
      }
    }
  }

  return (
    <Layout title='主页' {...settings}>
      {
        articles.map(article => (
          <ArticlePreview {...article} key={article.id}></ArticlePreview>
        ))
      }
      <Box sx={{ textAlign: 'center', display: loadButtonStatus === 'hidden' ? 'none' : null }}>
        <IconButton onClick={loadMore} disabled={loadButtonStatus === 'disabled'} >
          <ExpandMoreIcon></ExpandMoreIcon>
        </IconButton>
      </Box>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const beginArticleSnapPromise = getDocs(query(collection(db, 'articles'), orderBy('time', 'desc'), limit(1)))
  return await propsWrapper({ querySnapPromises: [beginArticleSnapPromise] })
}

export default HomePage
