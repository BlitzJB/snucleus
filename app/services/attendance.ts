import { db } from '../lib/firebase';
import { collection, doc, getDoc, getDocs, addDoc, query, where, Timestamp } from 'firebase/firestore';
import { handleFirebaseError } from '../lib/errorUtils';

const attendanceCollection = collection(db, 'attendance');

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  rollNumber: string;
  timestamp: Timestamp;
}

export async function logAttendance(sessionId: string, rollNumber: string): Promise<string> {
  try {
    const attendanceData = {
      sessionId,
      rollNumber,
      timestamp: Timestamp.now()
    };
    const docRef = await addDoc(attendanceCollection, attendanceData);
    return docRef.id;
  } catch (error) {
    handleFirebaseError(error);
    return '';
  }
}

export async function getAttendanceForSession(sessionId: string): Promise<AttendanceRecord[]> {
  try {
    const q = query(attendanceCollection, where('sessionId', '==', sessionId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AttendanceRecord));
  } catch (error) {
    handleFirebaseError(error);
    return [];
  }
}

export async function getAttendanceRecord(attendanceId: string): Promise<AttendanceRecord | null> {
  try {
    const attendanceDoc = doc(attendanceCollection, attendanceId);
    const attendanceSnapshot = await getDoc(attendanceDoc);
    return attendanceSnapshot.exists() ? { id: attendanceSnapshot.id, ...attendanceSnapshot.data() } as AttendanceRecord : null;
  } catch (error) {
    handleFirebaseError(error);
    return null;
  }
}

export async function getAttendanceCountForSession(sessionId: string): Promise<number> {
  try {
    const q = query(attendanceCollection, where('sessionId', '==', sessionId));
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    handleFirebaseError(error);
    return 0;
  }
}

export async function checkAttendance(sessionId: string, rollNumber: string): Promise<boolean> {
  try {
    const q = query(
      attendanceCollection,
      where('sessionId', '==', sessionId),
      where('rollNumber', '==', rollNumber)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    handleFirebaseError(error);
    return false;
  }
}
