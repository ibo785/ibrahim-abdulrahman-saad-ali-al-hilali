import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, OperationType } from '../types';
import { handleFirestoreError } from '../lib/errorHandlers';

const googleProvider = new GoogleAuthProvider();

export const subscribeToAuthChanges = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user profile exists in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      // Create initial profile
      const newProfile: Partial<UserProfile> = {
        uid: user.uid,
        name: user.displayName || 'Anonymous',
        email: user.email || '',
        role: 'user',
        points: 100, // Welcome points
        trustLevel: 5.0,
        avatar: user.photoURL || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      try {
        await setDoc(userDocRef, {
          ...newProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      }
    }
    
    return user;
  } catch (error) {
    console.error("Auth error", error);
    throw error;
  }
};

export const logout = () => signOut(auth);

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userDocRef = doc(db, 'users', uid);
  try {
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    return null;
  }
};
