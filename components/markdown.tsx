import { useEffect } from 'react'
import Typo from '../styles/typo.module.css'
import markdown, { routerifyMarkdownLinks, markdownWithHtml, getMarkdownScripts, displayMarkdownImageAlts } from '../utils/md'

type MarkdownProps = {
    children: string
}

const Markdown = ({ children }: MarkdownProps) => {
    useEffect(() => {
        routerifyMarkdownLinks()
    }, [])
    return (
        <div
            dangerouslySetInnerHTML={{ __html: `${markdown.render(children)}` }}
            className={Typo.typo}
        ></div>
    )
}

export const TrustedMarkdown = ({ children }: MarkdownProps) => {
    useEffect(() => {
        routerifyMarkdownLinks()
        displayMarkdownImageAlts()
        try {
            eval.call(window, getMarkdownScripts())
        } catch (error) { }
    }, [])
    return (
        <div
            dangerouslySetInnerHTML={{ __html: markdownWithHtml.render(children) }}
            className={Typo.typo}
        ></div>
    )
}

export default Markdown
