import AccountCircle from '@mui/icons-material/AccountCircle'
import GoogleIcon from '@mui/icons-material/Google'
import GitHubIcon from '@mui/icons-material/GitHub'
import TwitterIcon from '@mui/icons-material/Twitter'
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material'
import { GoogleAuthProvider, signOut as firebaseSignOut, signInWithPopup, AuthProvider, GithubAuthProvider, onAuthStateChanged, TwitterAuthProvider } from 'firebase/auth'
import Link from 'next/link'
import { useState } from 'react'
import { authentication } from '../utils/firebase'
import useFbUser from '../utils/hooks'
import Menu from '../components/menu'
import MenuIcon from '@mui/icons-material/Menu'
import Image from 'next/image'
import Logo from './logo.png'
import WestIcon from '@mui/icons-material/West'
import router from 'next/router'

export type LayoutBarProps = {
    tags: string
    title: string
}

const LayoutBar = ({ tags, title }: LayoutBarProps) => {
    const photoURL = useFbUser()?.photoURL
    const signIn = (provider: AuthProvider) => {
        const auth = authentication()
        signInWithPopup(auth, provider)
    }
    const signOut = () => {
        const auth = authentication()
        firebaseSignOut(auth)
    }

    return (
        <AppBar color='transparent' position='fixed' sx={{
            top: 0,
            backdropFilter: 'blur(5px)',
            backgroundColor: 'rgba(0,0,100,0.2)'
        }}>
            <Toolbar>
                <IconButton sx={{ mr: 2 }} onClick={() => router.back()}>
                    <WestIcon htmlColor='aliceblue'></WestIcon>
                </IconButton>
                <Link href='/'>
                    <Image src={Logo} height={30} width={25}></Image>
                </Link>
                <Link href='/'>
                    <Typography sx={{ ml: 1 }} variant='h5' color='aliceblue'>
                        {title}
                    </Typography>
                </Link>
                <Box sx={{ flexGrow: 1 }} />
                <Menu icon={<MenuIcon htmlColor='aliceblue'></MenuIcon>} items={tags.split(' ').map(tag => ({ text: tag, href: `/tag/${tag}` }))}></Menu>
                {
                    photoURL
                        ?
                        <IconButton onClick={signOut}>
                            <img src={photoURL} style={{ width: 40, borderRadius: 20 }}></img>
                        </IconButton>
                        :
                        <Menu items={[{
                            text: '通过 Twitter 登录', onClick: () => signIn(new TwitterAuthProvider()), icon: TwitterIcon
                        }, {
                            text: '通过 Google 登录', onClick: () => signIn(new GoogleAuthProvider()), icon: GoogleIcon
                        }, {
                            text: '通过 GitHub 登录', onClick: () => signIn(new GithubAuthProvider()), icon: GitHubIcon
                        }]} icon={<AccountCircle htmlColor='aliceblue' sx={{ borderRadius: 100 }}></AccountCircle>}></Menu>
                }
            </Toolbar>
        </AppBar>
    )
}

export default LayoutBar
