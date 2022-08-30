import { Box } from "@mui/material"
import Head from "next/head"
import Link from "next/link"

const Status500 = () => (
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
        <Head>
            <title>500</title>
        </Head>
        <Link href='/'>
            <img alt='500' src='/status/500.png'></img>
        </Link>
    </Box>
)

export default Status500
