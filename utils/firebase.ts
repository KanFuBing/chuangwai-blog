import { initializeApp } from 'firebase/app'
import { addDoc, doc, collection, DocumentData, DocumentSnapshot, getFirestore, QuerySnapshot, setDoc, deleteDoc, updateDoc, FieldValue, AddPrefixToKeys, getDocs, WriteBatch } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

initializeApp(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG as string))

export const storage = getStorage()
export const db = getFirestore()
export const authentication = () => getAuth() // 不可于服务器端调用

export const getQuerySnapDocsData = (snap: QuerySnapshot<DocumentData>) => (
    snap.docs.map(doc => ({ ...doc.data(), id: doc.id }))
)

export const getDocSnapsDocsData = (snap: DocumentSnapshot<DocumentData>[] | FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>[]) => (
    snap.map(doc => ({ ...doc.data(), id: doc.id }))
)

export const addFbDoc = (colName: string, data: Object) => (
    addDoc(collection(db, colName), data)
)

export const setFbDoc = (colName: string, docName: string, data: Object) => (
    setDoc(doc(db, colName, docName), data)
)

export const updateFbDoc = (colName: string, docName: string, data: { [x: string]: any } & AddPrefixToKeys<string, any>) => (
    updateDoc(doc(db, colName, docName), data)
)

export const deleteFbDoc = (colName: string, docName: string, batch?: WriteBatch) => (
    batch ? batch.delete(doc(db, colName, docName)) : deleteDoc(doc(db, colName, docName))
)
