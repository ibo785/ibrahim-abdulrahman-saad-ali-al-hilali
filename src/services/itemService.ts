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
  orderBy,
  limit,
  deleteDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Item, OperationType, ItemStatus } from '../types';
import { handleFirestoreError } from '../lib/errorHandlers';

const ITEMS_COLLECTION = 'items';

export const createItem = async (itemData: Partial<Item>) => {
  if (!auth.currentUser) throw new Error("Authentication required");
  
  const path = ITEMS_COLLECTION;
  try {
    const docRef = await addDoc(collection(db, path), {
      ...itemData,
      ownerId: auth.currentUser.uid,
      status: ItemStatus.AVAILABLE,
      viewsCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const updateItem = async (itemId: string, updates: Partial<Item>) => {
  const path = `${ITEMS_COLLECTION}/${itemId}`;
  try {
    const docRef = doc(db, ITEMS_COLLECTION, itemId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const getItem = async (itemId: string): Promise<Item | null> => {
  const path = `${ITEMS_COLLECTION}/${itemId}`;
  try {
    const docRef = doc(db, ITEMS_COLLECTION, itemId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Item;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
};

export const getItems = async (filters?: { categoryId?: string, status?: ItemStatus }) => {
  const path = ITEMS_COLLECTION;
  try {
    let q = query(collection(db, path), orderBy('createdAt', 'desc'));
    
    if (filters?.categoryId) {
      q = query(q, where('categoryId', '==', filters.categoryId));
    }
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    } else {
      q = query(q, where('status', '==', ItemStatus.AVAILABLE));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Item);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const deleteItem = async (itemId: string) => {
  const path = `${ITEMS_COLLECTION}/${itemId}`;
  try {
    await deleteDoc(doc(db, ITEMS_COLLECTION, itemId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};
