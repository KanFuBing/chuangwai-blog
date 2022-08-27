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
        <meta name='twitter:image' content='https://firebasestorage.googleapis.com/v0/b/chuang-wai.appspot.com/o/android-chrome-192x192.png?alt=media&token=8c579060-f410-4f25-ba87-5aefcb8b536e' />
    </Head>
)

export default LayoutTwitterCard
