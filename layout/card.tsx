import Head from 'next/head'

export type LayoutTwitterCardProps = {
    bg: string
    title: string
    cover?: string
}

const LayoutTwitterCard = ({ title, cover, bg }: LayoutTwitterCardProps) => (
    <Head>
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@KanFuBing' />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content='你好，一块浮冰上的博客。' />
        <meta name='twitter:image' content={cover ?? bg} />
    </Head>
)

export default LayoutTwitterCard
