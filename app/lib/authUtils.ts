import { auth } from './firebase';
import { User } from 'firebase/auth';
import { redirect } from 'next/navigation';

export async function protectRoute(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (!user || user.email !== 'joshuabharathi2k4@gmail.com') {
        auth.signOut().then(() => {
          redirect('/login');
        });
      }
      resolve(user);
    });
  });
}
