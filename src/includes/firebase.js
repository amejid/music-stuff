import { initializeApp } from 'firebase/app'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBN1YCJKujBwQha-12CO_EFmCIh6yo3j-c',
  authDomain: 'music-5ba25.firebaseapp.com',
  projectId: 'music-5ba25',
  storageBucket: 'music-5ba25.appspot.com',
  appId: '1:424815312264:web:e7374ece64e6d27c3a8e3d'
}

export default initializeApp(firebaseConfig)
