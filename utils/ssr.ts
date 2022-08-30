import { DocumentSnapshot, DocumentData, QuerySnapshot } from 'firebase/firestore'
import { GetServerSidePropsResult } from 'next'
import getDocSnap, { getDocSnapsDocsData } from './firebase'

const propsWrapper = async ({
    otherProps,
    docSnapPromises,
    querySnapPromises,
    ignoreDocNotFound,
    ignoreQueryDocsNotFound
}: {
    otherProps?: Object,
    docSnapPromises?: Promise<DocumentSnapshot<DocumentData>>[],
    querySnapPromises?: Promise<QuerySnapshot<DocumentData>>[],
    ignoreDocNotFound?: boolean,
    ignoreQueryDocsNotFound?: boolean
}): Promise<GetServerSidePropsResult<any>> => {
    const settingsSnapPromise = getDocSnap('settings', 'blog')
    let promises: (Promise<DocumentSnapshot<DocumentData>> | Promise<QuerySnapshot<DocumentData>>)[] = [settingsSnapPromise]

    if (docSnapPromises) {
        promises = promises.concat(docSnapPromises)
    }
    if (querySnapPromises) {
        promises = promises.concat(querySnapPromises)
    }

    const snaps = await Promise.all(promises)
    const querySnaps = ((querySnapPromises ? snaps.splice(snaps.length - querySnapPromises.length) : []) as QuerySnapshot<DocumentData>[])
        .filter(querySnap => !querySnap.empty)
    const docSnaps = ((docSnapPromises ? snaps.splice(snaps.length - docSnapPromises.length) : []) as DocumentSnapshot<DocumentData>[])
        .filter(docSnap => docSnap.exists())
    // 按照 Promise 参数分离查询快照和文档快照，并筛选出非空快照

    const notFound = (!ignoreQueryDocsNotFound && querySnapPromises && querySnapPromises.length > 0 && querySnaps.length === 0)
        || (!ignoreDocNotFound && docSnapPromises && docSnapPromises.length > 0 && docSnaps.length === 0)
    // 如果有快照 Promise 参数但没有非空快照，则判定为 404
    if (notFound) {
        return {
            notFound: true
        }
    }
    else {
        const settingsSnap = snaps[0] as DocumentSnapshot<DocumentData>
        const settings = settingsSnap.data()
        const docs = getDocSnapsDocsData(
            docSnaps.concat(querySnaps.flatMap(querySnap => querySnap.docs))
            // 含多个文档快照的查询快照数组（二维数组）化文档快照数组（一维数组）
        )
        const props = { ...otherProps, settings, docs }
        return { props }
    }
}

export default propsWrapper
