import { collection, getDocs, query, where } from 'firebase/firestore'
import { GetServerSideProps } from 'next'
import ArticlePreview from '../../components/preview'
import Layout from '../../layout'
import { db } from '../../utils/firebase'
import propsWrapper from '../../utils/ssr'
import { BlogPageProps, Article } from '../../utils/types'

type TaggedArticlesPageProps = BlogPageProps & {
  docs: Article[]
  tag: string
}

const TaggedArticlesPage = ({ docs, tag, settings }: TaggedArticlesPageProps) => (
  <Layout title={`含“${tag}”的文章`} {...settings}>
    {
      docs.map(article => (
        <ArticlePreview {...article} key={article.id}></ArticlePreview>
      ))
    }
  </Layout>
)

export const getServerSideProps: GetServerSideProps = async ctx => {
  const tag = ctx.query.tag
  const taggedArticlesSnapPromise = getDocs(query(collection(db, 'articles'), where('tags', 'array-contains', tag)))
  return await propsWrapper({ otherProps: { tag }, querySnapPromises: [taggedArticlesSnapPromise] })
}

export default TaggedArticlesPage
