import { NextApiRequest, NextApiResponse } from "next";
import { getColSnap } from "../../utils/firebase";
import propsWrapper from "../../utils/ssr";
import { Article } from "../../utils/types";

// For Google
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const articlesSnap = getColSnap('articles')
    const articles = (await propsWrapper({ querySnapPromises: [articlesSnap] }) as { props: Article[] }).props

    const prefix = `https://${req.headers.host}/`
    const articleIdsPaths = articles.map(article => `${prefix}article/${article.id}`)
    const articleTagsPaths = Array.from(new Set(
        articles.flatMap(article => article.tags.map(tag => `${prefix}tag/${tag}`))
    ))  // 提取各文章的标签数组并化为一维数组后去重

    const urls = [
        prefix,
        ...articleIdsPaths,
        ...articleTagsPaths,
        `${prefix}403`,
        `${prefix}404`,
        `${prefix}500`,
    ]
    res.status(200).send(urls.join('\n'))
}
