import { Toolbar, Box, Paper } from '@mui/material'
import Head from 'next/head'
import { ReactNode } from 'react'
import LayoutBar from './bar'
import { TrustedMarkdown } from '../components/md'
import Typo from '../styles/Typo.module.css'

type LayoutProps = {
    title: string
    profile: string
    name: string
    bg: string
    children: ReactNode
}

const Layout = ({ title, name, bg, profile, children }: LayoutProps) => (
    <Box sx={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        overflowY: 'auto',
    }}>
        <Head>
            <title>{`${title} | ${name}`}</title>
        </Head>
        <LayoutBar title={name}></LayoutBar>
        <Toolbar></Toolbar>
        <Box sx={{
            display: { sm: 'flex', xs: 'none' },
            m: '2% 0',
            padding: '0 2%',
            opacity: 0.9,
        }}>
            <Paper elevation={3} sx={{
                width: '65%',
                padding: 2,
                mr: '2%',
            }}>
                {children}
            </Paper>
            <Box sx={{
                width: '33%'
            }}>
                <Paper elevation={3} sx={{
                    width: '100%',
                    p: '2px 2px',
                    textAlign: 'center',
                }}>
                    <TrustedMarkdown className={Typo.typo}>
                        {profile}
                    </TrustedMarkdown>
                </Paper>
            </Box>
        </Box>

        <Box sx={{
            display: { sm: 'none', xs: undefined },
            m: '0 auto',
            width: '100%',
            padding: '2% 2%',
            opacity: '0.9',
        }}>
            <Paper elevation={3} sx={{
                width: '100%',
                padding: 2,
            }}>
                {children}
            </Paper>
            <br></br>
            <Paper elevation={3} sx={{
                width: '100%',
                p: '2px 2px',
                textAlign: 'center'
            }}>
                <TrustedMarkdown className={Typo.typo}>
                    {profile}
                </TrustedMarkdown>
            </Paper>
        </Box>
    </Box>
)

export default Layout
