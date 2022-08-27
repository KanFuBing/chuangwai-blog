import Typo from '../styles/typo.module.css'
import markdown, { markdownRouterLinks, markdownWithHtml } from '../utils/md'

type MarkdownProps = {
    children: string
}

const Markdown = ({ children }: MarkdownProps) => (
    <div
        dangerouslySetInnerHTML={{ __html: `${markdownRouterLinks} ${markdown.render(children)}` }}
        className={Typo.typo}
    ></div>
)

export const TrustedMarkdown = ({ children }: MarkdownProps) => (
    <div
        dangerouslySetInnerHTML={{ __html: `${markdownRouterLinks} ${markdownWithHtml.render(children)}` }}
        className={Typo.typo}
    ></div>
)

export default Markdown
