import getDocSnap from "../../../utils/firebase";
import propsWrapper from "../../../utils/ssr";

// For reposting
export default async (req, res) => {
    const { id } = req.query
    const articleSnap = getDocSnap('texts', id)
    const articleProps = await propsWrapper({ docSnapPromises: [articleSnap] })

    if (!articleProps.props) {
        res.status(404).send('Not Found')
    }
    else {
        const { md } = articleProps.props.docs[0]
        res.setDefaultEncoding('utf-8')
        res.status(200).send(md)
    }
}
