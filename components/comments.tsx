import { IconButton, Paper, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Comment } from '../utils/types'
import { User, onAuthStateChanged } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { authentication, deleteFbDoc } from '../utils/firebase'
import Markdown from './markdown'

type CommentsProps = {
    comments: Comment[]
}

const Comments = ({ comments }: CommentsProps) => {
    const [user, setUser] = useState<User>()
    useEffect(() => {
        const auth = authentication()
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            }
        })
    }, [])

    const [deletedCommentsIds, setDeletedCommentsIds] = useState<Set<string>>(new Set())
    const deleteComment = async (id: string) => {
        await deleteFbDoc('comments', id)
        setDeletedCommentsIds(deletedCommentsIds => new Set(deletedCommentsIds).add(id))
    }
    return (
        <>
            {
                comments.filter(comment => !deletedCommentsIds.has(comment.id)).map((comment, index) => (
                    <Paper elevation={3} key={index} sx={{
                        padding: 1,
                        position: 'relative',
                        marginTop: 4,
                    }}>
                        {
                            user && comment.uid === user.uid
                                ?
                                <IconButton sx={{ position: 'absolute', right: 0, top: 0 }} onClick={() => deleteComment(comment.id)}><DeleteIcon /></IconButton>
                                :
                                <></>
                        }
                        <Typography variant='caption'>
                            {new Date(comment.time.seconds * 1000).toLocaleDateString()}
                        </Typography>
                        <Typography variant='body1'>
                            {comment.user}
                        </Typography>
                        <Markdown>
                            {comment.md}
                        </Markdown>
                    </Paper>
                ))
            }
        </>
    )
}

export default Comments
