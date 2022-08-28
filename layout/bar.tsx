import AccountCircle from '@mui/icons-material/AccountCircle'
import GoogleIcon from '@mui/icons-material/Google'
import GitHubIcon from '@mui/icons-material/GitHub'
import { AppBar, Toolbar, Typography, IconButton, Box, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import { GoogleAuthProvider, signInWithPopup, AuthProvider, GithubAuthProvider, onAuthStateChanged } from 'firebase/auth'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { authentication } from '../utils/firebase'
import Image from 'next/image'

type LayoutBarProps = {
    title: string
}

const LayoutBar = ({ title }: LayoutBarProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const [avatar, setAvatar] = useState<string | null>(null)
    const signIn = (provider: AuthProvider) => {
        const auth = authentication()
        signInWithPopup(auth, provider).then(({ user }) => {
            setAvatar(user.photoURL)
        })
    }

    useEffect(() => {
        const auth = authentication()
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setAvatar(user.photoURL)
            }
        })
    }, [])

    return (
        <AppBar color='transparent' position='fixed' sx={{
            top: 0,
            backdropFilter: 'blur(5px)'
        }}>
            <Toolbar>
                <Link href='/'>
                    <Typography variant='h5' color='aliceblue' sx={{ textShadow: '0px 0px 1px darkblue, 0 0 1px darkblue, 0 0 1px darkblue' }}>{title}</Typography>
                </Link>
                <Box sx={{ flexGrow: 1 }} />
                {
                    avatar
                        ?
                        <IconButton>
                            <Image src={avatar} width={40} height={40} style={{ borderRadius: 20 }}></Image>
                        </IconButton>
                        :
                        <IconButton onClick={handleClick}>
                            <AccountCircle htmlColor='aliceblue' sx={{ bgcolor: 'black', borderRadius: 100 }}></AccountCircle>
                        </IconButton>
                }
            </Toolbar>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={() => signIn(new GoogleAuthProvider())}>
                    <ListItemIcon>
                        <GoogleIcon></GoogleIcon>
                    </ListItemIcon>
                    <ListItemText>
                        通过 Google 登录
                    </ListItemText>
                </MenuItem>
                <MenuItem onClick={() => signIn(new GithubAuthProvider())}>
                    <ListItemIcon>
                        <GitHubIcon></GitHubIcon>
                    </ListItemIcon>
                    <ListItemText>
                        通过 GitHub 登录
                    </ListItemText>
                </MenuItem>
            </Menu>
        </AppBar>
    )
}

export default LayoutBar
