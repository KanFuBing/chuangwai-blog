import { Box, Button, Divider, TextField } from '@mui/material'
import { GetServerSideProps } from 'next'
import router from 'next/router'
import { ChangeEvent, useState } from 'react'
import Popup from '../../../components/popup'
import Recheck from '../../../components/recheck'
import Layout from '../../../layout'
import { ssGetDocSnap } from '../../../utils/admin'
import { deleteFbDoc, updateFbDoc } from '../../../utils/firebase'
import propsWrapper from '../../../utils/ssr'
import { BlogPageProps, Tag } from '../../../utils/types'

type TagEditPageProps = BlogPageProps & {
    docs: Tag[]
}

const TagEditPage = ({ docs, settings }: TagEditPageProps) => {
    const tag = docs[0]

    const [description, setDescription] = useState(tag.description)
    const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value)
    }
    const [name, setName] = useState(tag.name)
    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    const [isOpen, setOpen] = useState(false)
    const [isSuccessful, setIsSuccessful] = useState(false)

    const publishTag = () => {
        updateFbDoc('tags', tag.id, { description, name })
            .then(() => {
                setOpen(true)
                setIsSuccessful(true)
            })
            .catch(() => {
                setOpen(true)
                setIsSuccessful(false)
            })
    }

    const [isRechecking, setIsRechecking] = useState(false)
    const deleteTag = async () => {
        await deleteFbDoc('tags', tag.id)
        router.push('/console')
    }

    const redirectToTag = () => {
        router.push(`/tag/${tag.name}`)
    }
    const redirectToConsole = () => {
        router.push('/console')
    }

    const BorderStyle = {
        p: 2,
        borderStyle: 'solid',
        borderWidth: 2,
        borderImage: 'linear-gradient(to right, #9958e4, #527aca) 1'
    }
    return (
        <Layout title={tag.name} {...settings}>
            <Box sx={BorderStyle}>
                <Button onClick={redirectToTag} fullWidth variant='outlined'>查看标签</Button>
                <br></br><br></br>
                <Button onClick={redirectToConsole} fullWidth variant='outlined'>回到控制台</Button>
                <br></br><br></br>
                <Divider sx={{ boxShadow: '3px 3px 3px black' }}></Divider>
                <br></br>

                <TextField
                    required
                    fullWidth
                    label={'name'}
                    onChange={handleNameChange}
                    value={name}
                />
                <br></br><br></br>
                <TextField
                    required
                    fullWidth
                    multiline
                    label={'description'}
                    onChange={handleDescriptionChange}
                    value={description}
                />
                <br></br><br></br>

                <Button onClick={publishTag}>
                    发布
                </Button>
            </Box>
            <br></br><br></br>

            <Button onClick={() => { setIsRechecking(true) }} color='error' variant='outlined'>
                删除
            </Button>

            <Popup isOpen={isOpen} isSuccessful={isSuccessful} setOpen={setOpen}></Popup>
            <Recheck isRechecking={isRechecking} setIsRechecking={setIsRechecking} operate={deleteTag}></Recheck>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
    const id = ctx.query.id as string
    return await propsWrapper({
        docSnapPromises: [ssGetDocSnap('tags', id)],
        ignoreDocNotFound: true
    })
}

export default TagEditPage
