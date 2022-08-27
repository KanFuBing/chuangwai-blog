import '../styles/globals.css'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@emotion/react'
import { useMediaQuery, createTheme, CssBaseline } from '@mui/material'
import { useEffect, useMemo } from 'react'
import { initializeApp, getApps } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import Loading from '../components/loading'

const Favicon = () => (<><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"></link><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"></link><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"></link><link rel="manifest" href="/site.webmanifest"></link></>)

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    if (getApps().length < 1) {
      initializeApp(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG as string))
      getAnalytics()
    }
  }, [])

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
        typography: {
          fontFamily: "'Noto Serif SC'",
        },
      }),
    [prefersDarkMode],
  )

  return (
    <ThemeProvider theme={theme}>
      <Favicon></Favicon>
      <CssBaseline />
      <Component {...pageProps} />
      <Loading></Loading>
    </ThemeProvider>
  )
}

export default App
