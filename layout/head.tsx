import Head from 'next/head'

export type LayoutHeadProps = {
    title: string
    name: string
    bg: string
    cover?: string
}

const LayoutHead = ({ title, name, bg, cover }: LayoutHeadProps) => (
    <Head>
        <title>{`${title} | ${name}`}</title>
        <meta name='theme-color' content='#081534' />
        <link rel='manifest' href='/manifest.json' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png'></link>
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png'></link>
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png'></link>
        <link rel='manifest' href='/site.webmanifest'></link>

        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@KanFuBing' />
        <meta name='twitter:title' content={`${title} | ${name}`} />
        <meta name='twitter:description' content='茫茫海上。' />
        <meta name='twitter:image' content={cover ?? bg} />
    </Head>
)

export default LayoutHead
