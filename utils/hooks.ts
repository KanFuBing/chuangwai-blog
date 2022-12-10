import { User, onAuthStateChanged } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { authentication } from './firebase'

const useFbUser = () => {
    const [user, setUser] = useState<User | null>()
    useEffect(() => {
        const auth = authentication()
        onAuthStateChanged(auth, (user) => {
            setUser(user)
        })
    }, [])
    return user
}

export default useFbUser
