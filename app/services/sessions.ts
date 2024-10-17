import { db } from '../lib/firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { handleFirebaseError } from '../lib/errorUtils';

const sessionsCollection = collection(db, 'sessions');

export interface Session {
  id: string;
  name: string;
  seriesTag: string;
}

export async function getSessions(): Promise<Session[]> {
  try {
    const snapshot = await getDocs(sessionsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
  } catch (error) {
    handleFirebaseError(error);
    return [];
  }
}

export async function getSession(sessionId: string): Promise<Session | null> {
  try {
    const sessionDoc = doc(sessionsCollection, sessionId);
    const sessionSnapshot = await getDoc(sessionDoc);
    return sessionSnapshot.exists() ? { id: sessionSnapshot.id, ...sessionSnapshot.data() } as Session : null;
  } catch (error) {
    handleFirebaseError(error);
    return null;
  }
}

export async function createSession(sessionData: Omit<Session, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(sessionsCollection, sessionData);
    return docRef.id;
  } catch (error) {
    handleFirebaseError(error);
    return '';
  }
}

export async function updateSession(sessionId: string, sessionData: Partial<Session>): Promise<void> {
  try {
    const sessionDoc = doc(sessionsCollection, sessionId);
    await updateDoc(sessionDoc, sessionData);
  } catch (error) {
    handleFirebaseError(error);
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  try {
    const sessionDoc = doc(sessionsCollection, sessionId);
    await deleteDoc(sessionDoc);
  } catch (error) {
    handleFirebaseError(error);
  }
}

export async function searchSessions(searchTerm: string): Promise<Session[]> {
  try {
    const q = query(
      sessionsCollection,
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
  } catch (error) {
    handleFirebaseError(error);
    return [];
  }
}
