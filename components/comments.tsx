import { IconButton, Paper, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Comment } from '../utils/types'
import { useState } from 'react'
import { deleteFbDoc } from '../utils/firebase'
import Markdown from './markdown'
import useFbUser from '../utils/hooks'

type CommentsProps = {
    comments: Comment[]
}

const Comments = ({ comments }: CommentsProps) => {
    const user = useFbUser()

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
                        <Typography variant='body2'>
                            {new Date(comment.time).toLocaleDateString()}
                        </Typography>
                        <Typography variant='h5'>
                            {comment.user}<Typography variant='caption'>留言者</Typography>
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
