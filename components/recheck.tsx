import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material"
import { Dispatch, SetStateAction } from "react"

type RecheckProps = {
    isRechecking: boolean
    setIsRechecking: Dispatch<SetStateAction<boolean>>
    operate: Function
}

const Recheck = ({ isRechecking, setIsRechecking, operate }: RecheckProps) => (
    <Dialog
        open={isRechecking}
        onClose={() => setIsRechecking(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            再次确认
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                注意！你正在执行的操作，如果按下确定，就没有回头路了。
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setIsRechecking(false)}>放弃</Button>
            <Button onClick={() => { operate() }} autoFocus color='error'>
                确定
            </Button>
        </DialogActions>
    </Dialog>
)

export default Recheck
