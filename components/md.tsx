import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { ReactMarkdownOptions } from "react-markdown/lib/react-markdown"
import rehypeRaw from "rehype-raw"

type MarkdownProps = ReactMarkdownOptions & {
    children: string
}

const Markdown = ({ children, ...props }: MarkdownProps) => (
    <ReactMarkdown
        {...props}
        components={{
            a: ({ node, ...props }) => {
                return (
                    <Link href={props.href as string}>
                        <a
                            target={
                                props.href?.includes("http") ? "_blank" : "_self"
                            }
                        >
                            {props.children[0]}
                        </a>
                    </Link>
                );
            },
        }}
    >
        {children}
    </ReactMarkdown>
)

export const TrustedMarkdown = ({ children, ...props }: MarkdownProps) => (
    <Markdown
        {...props}
        rehypePlugins={[rehypeRaw]}
    >
        {children}
    </Markdown>
)

export default Markdown
