import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
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
