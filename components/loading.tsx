import { Box, LinearProgress } from '@mui/material'
import router from 'next/router'
import { useEffect, useState } from 'react'

const Loading = () => {
    const [isLoading, setLoading] = useState(false)
    useEffect(() => {
        router.events.on('routeChangeStart', () => setLoading(true))
        router.events.on('routeChangeComplete', () => setLoading(false))
        router.events.on('routeChangeError', () => setLoading(false))
    }, [])
    return (
        <Box sx={{ position: 'absolute', top: 0, width: '100%' }}>
            <LinearProgress sx={{ display: isLoading ? undefined : 'none' }} />
            <br></br>
        </Box>
    )
}

export default Loading
