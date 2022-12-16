import { Box, Pagination, PaginationItem } from '@mui/material'
import { GetServerSideProps } from 'next'
import ArticlePreview from '../components/preview'
import Layout from '../layout'
import propsWrapper from '../utils/ssr'
import { BlogPageProps, Article } from '../utils/types'
import { adminDb } from '../utils/admin'
import router from 'next/router'

type HomePageProps = BlogPageProps & {
  docs: Article[]
  count: number
  page: number
}

const ARTICLE_NUM_PER_PAGE = 5

const HomePage = ({ docs, settings, count, page }: HomePageProps) => {
  return (
    <Layout title='主页' {...settings}>
      {
        docs.map(article => (
          <ArticlePreview {...article} key={article.id}></ArticlePreview>
        ))
      }

      <Pagination
        sx={{ display: 'flex', justifyContent: 'center' }}
        variant='outlined'
        color='primary'
        page={page}
        count={Math.ceil(count / ARTICLE_NUM_PER_PAGE)}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            onClick={() => router.push(`?page=${item.page}`)}
          />
        )}
      ></Pagination>

      <br></br>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const page = parseInt(typeof ctx.query.page == 'string' ? ctx.query.page : '1')
  const articlesSnapPromise = adminDb.collection('articles').orderBy('time', 'desc').offset(ARTICLE_NUM_PER_PAGE * (page - 1)).limit(ARTICLE_NUM_PER_PAGE).get()
  return await propsWrapper({ querySnapPromises: [articlesSnapPromise], colToGetCount: 'articles', otherProps: { page } })
}

export default HomePage
