import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore'
import { getApps } from 'firebase-admin/app'
import admin from 'firebase-admin'

const { FIREBASE_ADMIN_CONFIG } = process.env
if (FIREBASE_ADMIN_CONFIG && getApps().length < 1) {
    const config = FIREBASE_ADMIN_CONFIG.replace(/\\n/g, '\\n').replace(/\\'/g, "\\'").replace(/\\'/g, '\\"').replace(/\\&/g, '\\&').replace(/\\r/g, '\\r').replace(/\\t/g, '\\t').replace(/\\b/g, '\\b').replace(/\\f/g, '\\f')
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(config))
    })
}

export const adminDb = getAdminFirestore()

// Server-side 操作

export const ssGetDocSnap = (colName: string, docName: string) => (
    adminDb.collection(colName).doc(docName).get()
)

export const ssGetColSnap = (colName: string) => (
    adminDb.collection(colName).get()
)
