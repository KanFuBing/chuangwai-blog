import { IconButton, TextField } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { Dispatch, SetStateAction, useState } from 'react'
import { addFbDoc } from '../utils/firebase'
import { serverTimestamp, Timestamp } from 'firebase/firestore'
import { Comment } from '../utils/types'
import Popup from './popup'
import useFbUser from '../utils/hooks'

type NewCommentProps = {
    articleId: string
    setUserComments: Dispatch<SetStateAction<Comment[]>>
}

const NewComment = ({ articleId, setUserComments }: NewCommentProps) => {
    const [value, setValue] = useState('')
    const [isDisabled, setDisabled] = useState(true)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setValue(value)
        setDisabled(value === '' || !user)
    }

    const user = useFbUser()
    const [isOpen, setOpen] = useState(false)
    const [isSuccessful, setIsSuccessful] = useState(false)
    const send = () => {
        if (user) {
            setDisabled(true)
            addFbDoc('comments', { user: user.displayName, uid: user.uid, time: serverTimestamp(), md: value, article: articleId })
                .then(docRef => {
                    setValue('')
                    setUserComments(comments => [...comments, { id: docRef.id, user: user.displayName as string, uid: user.uid, time: Date.now(), md: value, article: articleId }])
                    setDisabled(false)
                    setOpen(true)
                    setIsSuccessful(true)
                })
                .catch(() => {
                    setDisabled(false)
                    setOpen(true)
                    setIsSuccessful(false)
                })
        }
    }

    return (
        <>
            <TextField
                placeholder='评论前请登录。支持 Markdown。'
                variant='filled'
                rows={5}
                fullWidth
                multiline
                value={value}
                onChange={handleChange}
            />
            <IconButton sx={{ float: 'right' }} onClick={send} disabled={isDisabled}><SendIcon></SendIcon></IconButton>

            <Popup isOpen={isOpen} isSuccessful={isSuccessful} setOpen={setOpen}></Popup>
        </>
    )
}

export default NewComment
