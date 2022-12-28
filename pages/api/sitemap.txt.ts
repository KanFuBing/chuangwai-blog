import { NextApiRequest, NextApiResponse } from 'next'
import { ssGetColSnap } from '../../utils/admin'
import propsWrapper from '../../utils/ssr'
import { Article } from '../../utils/types'

// 暂时不可用
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const articlesSnap = ssGetColSnap('articles')
    const articles = (
        await propsWrapper(
            { querySnapPromises: [articlesSnap] }
        ) as { props: { docs: Article[] } }
    ).props.docs

    const prefix = `https://${req.headers.host}/`
    const articleIdsPaths = articles.map(article => `${prefix}article/${article.id}`)
    const articleTagsPaths = Array.from(new Set(
        articles.flatMap(article => article.tags.filter(tag => /^[A-Za-z0-9]*$/.test(tag) && tag !== '').map(tag => `${prefix}tag/${tag}`))
    ))  // 提取各文章的标签数组并化为一维数组后去重

    const urls = [
        prefix,
        ...articleIdsPaths,
        ...articleTagsPaths,
    ]
    res.status(200).send(urls.join('\n'))
}
