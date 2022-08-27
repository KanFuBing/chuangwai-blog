import Head from 'next/head'

type LayoutTwitterCardProps = {
    title: string
}

const LayoutTwitterCard = ({ title }: LayoutTwitterCardProps) => (
    <Head>
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@KanFuBing' />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content='你好，一块浮冰上的博客。' />
        <meta name='twitter:image' content='' />
    </Head>
)

export default LayoutTwitterCard
