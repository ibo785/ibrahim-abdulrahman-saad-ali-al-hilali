import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Transaction, OperationType, TransactionStatus, ItemStatus } from '../types';
import { handleFirestoreError } from '../lib/errorHandlers';

const TRANSACTIONS_COLLECTION = 'transactions';

export const requestItem = async (itemId: string, providerId: string, message: string, type: string) => {
  if (!auth.currentUser) throw new Error("Authentication required");
  
  const path = TRANSACTIONS_COLLECTION;
  try {
    const docRef = await addDoc(collection(db, path), {
      itemId,
      providerId,
      receiverId: auth.currentUser.uid,
      message,
      type,
      status: TransactionStatus.PENDING,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const updateTransactionStatus = async (transactionId: string, status: TransactionStatus) => {
  const path = `${TRANSACTIONS_COLLECTION}/${transactionId}`;
  try {
    const docRef = doc(db, TRANSACTIONS_COLLECTION, transactionId);
    
    if (status === TransactionStatus.COMPLETED) {
      // Atomic operation to update transaction and item status + award points
      await runTransaction(db, async (txn) => {
        const transSnap = await txn.get(docRef);
        if (!transSnap.exists()) throw new Error("Transaction not found");
        
        const data = transSnap.data() as Transaction;
        const itemRef = doc(db, 'items', data.itemId);
        const providerRef = doc(db, 'users', data.providerId);
        const receiverRef = doc(db, 'users', data.receiverId);
        
        txn.update(docRef, { status: TransactionStatus.COMPLETED, updatedAt: serverTimestamp(), completedAt: serverTimestamp() });
        txn.update(itemRef, { status: ItemStatus.EXCHANGED, updatedAt: serverTimestamp() });
        
        // Award points (Donation focus)
        const providerSnap = await txn.get(providerRef);
        const receiverSnap = await txn.get(receiverRef);
        
        if (providerSnap.exists()) {
          const currentPoints = providerSnap.data().points || 0;
          txn.update(providerRef, { points: currentPoints + 50 }); // Higher points for giving
        }
        
        if (receiverSnap.exists()) {
          const currentPoints = receiverSnap.data().points || 0;
          txn.update(receiverRef, { points: currentPoints + 10 });
        }
      });
    } else {
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const getTransactions = async (role: 'provider' | 'receiver') => {
  if (!auth.currentUser) return [];
  const field = role === 'provider' ? 'providerId' : 'receiverId';
  
  const path = TRANSACTIONS_COLLECTION;
  try {
    const q = query(collection(db, path), where(field, '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Transaction);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};
