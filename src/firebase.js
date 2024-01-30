import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDpmx6q95IanCJzISppyS4pFcZnY8DytWg",
  authDomain: "api-test-6e45c.firebaseapp.com",
  databaseURL: "https://api-test-6e45c-default-rtdb.firebaseio.com",
  projectId: "api-test-6e45c",
  storageBucket: "api-test-6e45c.appspot.com",
  messagingSenderId: "220690091504",
  appId: "1:220690091504:web:d2d7caf35bac93c7a6e135",
  measurementId: "G-BQBPWN4W62"
};
  

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };