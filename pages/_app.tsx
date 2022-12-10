import '../styles/globals.css'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@emotion/react'
import { useMediaQuery, createTheme, CssBaseline } from '@mui/material'
import { useEffect, useMemo } from 'react'
import { initializeApp, getApps } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import { getAnalytics } from 'firebase/analytics'
import Loading from '../components/loading'
import { getPerformance } from 'firebase/performance'

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    if (getApps().length < 1) {
      initializeApp(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG as string))
    }
    getAnalytics()
    getPerformance()

    if (process.env.NEXT_PUBLIC_ENV === 'development') {
      self['FIREBASE_APPCHECK_DEBUG_TOKEN'] = true
    }
    initializeAppCheck(undefined, {
      provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_PUBLIC_KEY as string),
      isTokenAutoRefreshEnabled: true
    })
  }, [])

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
        typography: {
          fontFamily: '"Noto Serif SC"',
        },
      }),
    [prefersDarkMode],
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
      <Loading></Loading>
    </ThemeProvider>
  )
}

export default App
