import { useMutation, useQuery } from '@tanstack/react-query';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { useFirestore } from './firebase';

export const useGetDocData = (collectionName: string, id: string) => {
  const firestore = useFirestore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['useGetDocData', collectionName, id],
    queryFn: async () => {
      const docRef = doc(firestore, collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // Document does not exist
        return undefined;
      }
    },
    staleTime: 1000 * 60 * 1, // 1 minute stale time
  });

  return { data, isLoading, isError };
};

export const useUpsertDoc = (collectionName: string, id: string | null) => {
  const firestore = useFirestore();

  return useMutation({
    mutationFn: async (data: any) => {
      let docRef;

      // If an ID is provided, use it, otherwise create a reference with a new ID
      if (id) {
        docRef = doc(firestore, collectionName, id);
      } else {
        docRef = doc(collection(firestore, collectionName)); // Automatically generates a new ID
      }

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Document exists, perform an update
        await setDoc(docRef, data, { merge: true });
      } else {
        // Document does not exist, create a new document
        await setDoc(docRef, data);
      }

      return docRef.id;
    },
  });
};
