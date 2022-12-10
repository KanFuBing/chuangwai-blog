import { Snackbar, Alert } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'

type PopupProps = {
    isOpen: boolean
    isSuccessful: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}

const Popup = ({ isOpen, isSuccessful, setOpen }: PopupProps) => (
    <Snackbar open={isOpen} autoHideDuration={6000} onClose={(event?: React.SyntheticEvent | Event, reason?: string) => { if (reason !== 'clickaway') { setOpen(false) } }}>
        <Alert onClose={(event?: React.SyntheticEvent | Event, reason?: string) => { if (reason !== 'clickaway') { setOpen(false) } }} severity={isSuccessful ? 'success' : 'error'} sx={{ width: '100%' }}>
            {isSuccessful ? '已送出。' : '失败。'}
        </Alert>
    </Snackbar>
)

export default Popup
