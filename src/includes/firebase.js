import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBN1YCJKujBwQha-12CO_EFmCIh6yo3j-c',
  authDomain: 'music-5ba25.firebaseapp.com',
  projectId: 'music-5ba25',
  storageBucket: 'music-5ba25.appspot.com',
  appId: '1:424815312264:web:e7374ece64e6d27c3a8e3d'
}

firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

db.enablePersistence().catch((err) => {
  console.log(`Firebase persistence error ${err.code}`)
})

const usersCollection = db.collection('users')
const songsCollection = db.collection('songs')
const commentsCollection = db.collection('comments')

export { auth, db, storage, usersCollection, songsCollection, commentsCollection }
