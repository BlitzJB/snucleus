'use client';

import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user.email === 'joshuabharathi2k4@gmail.com') {
        router.push('/');
      } else {
        await auth.signOut();
        setError('Unauthorized user. Please use the correct Google account.');
      }
    } catch (error) {
      setError('An error occurred during sign-in. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <button
        onClick={handleGoogleSignIn}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Sign in with Google
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
