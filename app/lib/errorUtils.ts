import { FirebaseError } from 'firebase/app';

export function handleFirebaseError(error: unknown) {
  if (error instanceof FirebaseError) {
    if (error.code === 'permission-denied' || error.code === 'unauthenticated') {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    // Handle other Firebase errors as needed
    console.error('Firebase error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
