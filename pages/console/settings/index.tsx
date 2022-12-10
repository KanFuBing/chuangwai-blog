import { Box, Button, TextField } from '@mui/material'
import { GetServerSideProps } from 'next'
import { ChangeEvent, useState } from 'react'
import Popup from '../../../components/popup'
import Layout from '../../../layout'
import { setFbDoc } from '../../../utils/firebase'
import propsWrapper from '../../../utils/ssr'
import { BlogPageProps } from '../../../utils/types'

const SettingsEditPage = ({ settings: settingsBefore }: BlogPageProps) => {
    const [settings, setSettings] = useState(settingsBefore)

    const [isOpen, setOpen] = useState(false)
    const [isSuccessful, setIsSuccessful] = useState(false)

    const handleSettingsChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
        setSettings(settings => ({ ...settings, [key]: event.target.value }))
    }
    const publishSettings = () => {
        setFbDoc('settings', 'blog', settings)
            .then(() => {
                setOpen(true)
                setIsSuccessful(true)
            })
            .catch(() => {
                setOpen(true)
                setIsSuccessful(false)
            })
    }

    const BorderStyle = {
        p: 2,
        borderStyle: 'solid',
        borderWidth: 2,
        borderImage: 'linear-gradient(to right, #9958e4, #527aca) 1'
    }
    return (
        <Layout title='设定' {...settings}>
            <Box sx={BorderStyle}>
                {
                    Object.keys(settings).map(key => (
                        <Box key={key}>
                            <TextField
                                required
                                fullWidth
                                multiline={key === 'profile'}
                                label={key}
                                onChange={e => handleSettingsChange(e, key)}
                                value={settings[key]}
                            />
                            <br></br><br></br>
                        </Box>
                    ))
                }
                <Button onClick={publishSettings}>
                    发布
                </Button>
            </Box>

            <Popup isOpen={isOpen} isSuccessful={isSuccessful} setOpen={setOpen}></Popup>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
    return await propsWrapper({})
}

export default SettingsEditPage
