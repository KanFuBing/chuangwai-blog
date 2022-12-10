import { Toolbar, Box, Paper, Typography } from '@mui/material'
import { ReactNode } from 'react'
import LayoutBar, { LayoutBarProps } from './bar'
import { TrustedMarkdown } from '../components/markdown'
import LayoutHead, { LayoutHeadProps } from './head'
import { use100vh } from 'react-div-100vh'

type LayoutProps = LayoutHeadProps & LayoutBarProps & {
    profile: string
    name: string
    children: ReactNode
}

const Layout = ({ title, cover, name, bg, profile, children, tags }: LayoutProps) => {
    const fullHeight = use100vh() ?? '100vh'
    return (
        <Box sx={{
            width: '100%',
            height: fullHeight,
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            overflowY: 'auto',
            overflowX: 'hidden'
        }}>
            <LayoutHead title={title} name={name} cover={cover} bg={bg}></LayoutHead>
            <LayoutBar title={name} tags={tags}></LayoutBar>
            <Toolbar></Toolbar>
            <Box sx={{
                display: { sm: 'flex', xs: 'none' },
                m: '2% 0',
                padding: '0 2%',
                opacity: 0.9,
            }}>
                <Box sx={{
                    width: '65%',
                    mr: '2%',
                }}>
                    <Paper elevation={3} sx={{
                        width: '100%',
                        padding: 2,
                    }}>
                        {children}
                    </Paper>
                    <br></br>
                    <br></br>
                </Box>
                <Box sx={{
                    width: '33%'
                }}>
                    <Paper elevation={3} sx={{
                        width: '100%',
                        p: 3,
                        textAlign: 'center',
                    }}>
                        <TrustedMarkdown>
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
                    p: 3,
                    textAlign: 'center'
                }}>
                    <TrustedMarkdown>
                        {profile}
                    </TrustedMarkdown>
                </Paper>
                <br></br>
            </Box>
        </Box>
    )
}

export default Layout
