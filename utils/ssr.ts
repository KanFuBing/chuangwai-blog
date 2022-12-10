import { DocumentData, QuerySnapshot } from 'firebase/firestore'
import { GetServerSidePropsResult } from 'next'
import { getDocSnapsDocsData } from './firebase'
import { ssGetDocSnap } from './admin'

const propsWrapper = async ({
    otherProps,
    docSnapPromises,
    querySnapPromises,
    ignoreDocNotFound,
    ignoreQueryDocsNotFound
}: {
    otherProps?: Object,
    docSnapPromises?: Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>>[],
    querySnapPromises?: Promise<FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>>[],
    ignoreDocNotFound?: boolean,
    ignoreQueryDocsNotFound?: boolean
}): Promise<GetServerSidePropsResult<any>> => {
    const settingsSnapPromise = ssGetDocSnap('settings', 'blog')
    let promises: (Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>> | Promise<FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>>)[] = [settingsSnapPromise]

    if (docSnapPromises) {
        promises = promises.concat(docSnapPromises)
    }
    if (querySnapPromises) {
        promises = promises.concat(querySnapPromises)
    }

    const snaps = await Promise.all(promises)
    const querySnaps = ((querySnapPromises ? snaps.splice(snaps.length - querySnapPromises.length) : []) as FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>[])
        .filter(querySnap => !querySnap.empty)
    const docSnaps = ((docSnapPromises ? snaps.splice(snaps.length - docSnapPromises.length) : []) as FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>[])
        .filter(docSnap => docSnap.exists)
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
        const settingsSnap = snaps[0] as FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
        const settings = settingsSnap.data()
        const docs = getDocSnapsDocsData(
            docSnaps.concat(querySnaps.flatMap(querySnap => querySnap.docs) as unknown as FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>[])
            // 含多个文档快照的查询快照数组（二维数组）化文档快照数组（一维数组）
        ).map(doc => (doc as any).time?.toDate ? Object.assign(doc, { time: (doc as any).time.toDate().getTime() }) : doc)
        // Timestamp -> Number
        const props = { ...otherProps, settings, docs }
        return { props }
    }
}

export default propsWrapper
