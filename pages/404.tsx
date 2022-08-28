import { Box } from "@mui/material"
import Image from "next/image"
import Link from "next/link"

const Status404 = () => (
    <Box sx={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(45deg, #e7e9fd 25%, #d0d9ff 0, #d0d9ff 50%, #e7e9fd 0, #e7e9fd 75%, #d0d9ff 0)',
        backgroundSize: '30px 30px'
    }}>
        <Link href='/'>
            <img alt='404' src='/status/404.png'></img>
        </Link>
    </Box>
)

export default Status404
