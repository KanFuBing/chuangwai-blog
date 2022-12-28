import { Divider, Typography } from '@mui/material'
import { GetServerSideProps } from 'next'
import { TrustedMarkdown } from '../../components/markdown'
import ArticlePreview from '../../components/preview'
import Layout from '../../layout'
import { adminDb } from '../../utils/admin'
import propsWrapper from '../../utils/ssr'
import { BlogPageProps, Article, Tag } from '../../utils/types'

type TaggedArticlesPageProps = BlogPageProps & {
  docs: (Article | Tag)[]
  tag: string
}

const TaggedArticlesPage = ({ docs, tag, settings }: TaggedArticlesPageProps) => {
  const articles = docs.filter(doc => doc.hasOwnProperty('title')) as Article[]
  const { name, description } = (docs.find(doc => doc.hasOwnProperty('name')) ?? { name: tag }) as Tag

  return (
    <Layout title={`含“${name}”的文章`} {...settings}>
      <Typography variant='h3'>{name}</Typography>
      {
        description
          ?
          <Typography style={{
            opacity: 0.9,
            borderLeft: '1px solid #1abc9c',
            paddingLeft: '1em',
            margin: '1em 3em 1em 2em'
          }}>
            <TrustedMarkdown>{description}</TrustedMarkdown>
          </Typography>
          :
          <br></br>
      }
      <Divider></Divider>
      <br></br>
      {
        articles.map(article => (
          <ArticlePreview {...article} key={article.id}></ArticlePreview>
        ))
      }
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const tag = ctx.query.tag
  const tagSnapPromise = adminDb.collection('tags').where('name', '==', tag).limit(1).get()
  const taggedArticlesSnapPromise = adminDb.collection('articles').orderBy('time').where('tags', 'array-contains', tag).get()
  return await propsWrapper({
    querySnapPromises: [taggedArticlesSnapPromise, tagSnapPromise],
    otherProps: { tag }
  })
}

export default TaggedArticlesPage
