import { IconButton, Box } from '@mui/material'
import { collection, getDocs, limit, orderBy, query, startAfter, QueryDocumentSnapshot } from 'firebase/firestore'
import { GetServerSideProps } from 'next'
import { useState } from 'react'
import ArticlePreview from '../components/preview'
import Layout from '../layout'
import { db, getQuerySnapDocsData } from '../utils/firebase'
import propsWrapper from '../utils/ssr'
import { BlogPageProps, Article } from '../utils/types'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { adminDb } from '../utils/admin'
import lastElementOf from '../utils/data'

type HomePageProps = BlogPageProps & {
  docs: Article[]
}

const ARTICLES_PER_LOAD = 5

enum LoadStatus {
  loading,
  fullyLoaded,
  free
}

const HomePage = ({ docs, settings }: HomePageProps) => {
  const [articles, setArticles] = useState<Article[]>(docs)
  const [loadStatus, setLoadStatus] = useState(LoadStatus.free)
  const [cursor, setCursor] = useState(lastElementOf(docs).time)

  const loadMore = async () => {
    setLoadStatus(LoadStatus.loading)
    const loadQ = query(collection(db, 'articles'), orderBy('time', 'desc'), startAfter(cursor), limit(ARTICLES_PER_LOAD))
    const loadingArticlesSnap = await getDocs(loadQ)
    const loadingArticles = getQuerySnapDocsData(loadingArticlesSnap) as Article[]

    const displayArticles = articles.concat(loadingArticles)
    setArticles(displayArticles)
    setCursor(lastElementOf(displayArticles).time)
    if (loadingArticles.length < ARTICLES_PER_LOAD) {
      setLoadStatus(LoadStatus.fullyLoaded)
    }
    else {
      setLoadStatus(LoadStatus.free)
    }
  }

  return (
    <Layout title='主页' {...settings}>
      {
        articles.map(article => (
          <ArticlePreview {...article} key={article.id}></ArticlePreview>
        ))
      }
      <Box sx={{ textAlign: 'center', display: loadStatus === LoadStatus.fullyLoaded ? 'none' : null }}>
        <IconButton onClick={loadMore} disabled={loadStatus === LoadStatus.loading} >
          <ExpandMoreIcon></ExpandMoreIcon>
        </IconButton>
      </Box>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const beginArticleSnapPromise = adminDb.collection('articles').orderBy('time', 'desc').limit(ARTICLES_PER_LOAD).get()
  return await propsWrapper({ querySnapPromises: [beginArticleSnapPromise] })
}

export default HomePage
