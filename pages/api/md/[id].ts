import { NextApiRequest, NextApiResponse } from 'next'
import { ssGetDocSnap } from '../../../utils/admin'

// For reposting
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query
    const article = (await ssGetDocSnap('texts', id as string)).data()

    if (!article) {
        res.status(404).send('Not Found')
    }
    else {
        const { md } = article
        res.status(200).send(article)
    }
}
