import { db } from '../lib/firebase';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const usersCollection = collection(db, 'users');

export async function getUser(userId: string) {
  const userDoc = doc(usersCollection, userId);
  const userSnapshot = await getDoc(userDoc);
  return userSnapshot.exists() ? userSnapshot.data() : null;
}

export async function createUser(userId: string, userData: any) {
  const userDoc = doc(usersCollection, userId);
  await setDoc(userDoc, userData);
}

export async function updateUser(userId: string, userData: Partial<any>) {
  const userDoc = doc(usersCollection, userId);
  await updateDoc(userDoc, userData);
}
