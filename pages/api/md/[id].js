import { ssGetDocSnap } from '../../../utils/admin'
import propsWrapper from '../../../utils/ssr'

// For reposting
export default async (req, res) => {
    const { id } = req.query
    const articleSnap = ssGetDocSnap('texts', id)
    const articleProps = (await propsWrapper({ docSnapPromises: [articleSnap] })).props

    if (!articleProps) {
        res.status(404).send('Not Found')
    }
    else {
        const { md } = articleProps.docs[0]
        res.status(200).send(Buffer.from(md).toString('base64'))
    }
}
