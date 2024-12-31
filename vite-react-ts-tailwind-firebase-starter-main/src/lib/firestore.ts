import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { collection, deleteDoc, doc, getDoc, getDocs, query, QueryConstraint, setDoc } from 'firebase/firestore';
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

export const useUpsertDoc = (collectionName: string) => {
  const firestore = useFirestore();

  return useMutation({
    mutationFn: async (data: any) => {
      let docRef;

      // If an ID is provided, use it, otherwise create a reference with a new ID
      if (data.documentId) {
        docRef = doc(firestore, collectionName, data.documentId);
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

export const useGetDocsData = (collectionName: string, ...queryConstraints: Array<QueryConstraint>) => {
  const firestore = useFirestore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['useGetDocsData', collectionName, JSON.stringify(queryConstraints)],
    queryFn: async () => {
      // Build the query with the given constraints
      const docRefs = query(collection(firestore, collectionName), ...queryConstraints);
      const docSnap = await getDocs(docRefs);

      // Process the results and return the documents' data
      let documents: any = [];

      docSnap.forEach((doc) => {
        const docData = doc.data();
        documents.push({ documentId: doc.id, ...docData });
      });

      return documents;
    },
    staleTime: 1000 * 60 * 1, // 1 minute stale time
  });

  return { data, isLoading, isError };
};

export const useDeleteDoc = (collectionName: string, onSuccess: () => void = () => {}) => {
  const firestore = useFirestore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // Reference the document to be deleted
      const docRef = doc(firestore, collectionName, id);

      // Delete the document
      await deleteDoc(docRef);

      // Optionally return the id of the deleted document for confirmation
      return id;
    },
    onSuccess: () => {
      // Invalidate queries when mutation is successful
      queryClient.invalidateQueries({ queryKey: ['useGetDocsData', collectionName] });
      queryClient.invalidateQueries({ queryKey: ['useGetDocData', collectionName] });
      onSuccess();
    },
  });
};

// This should probably use setDocs and getDocs (plural) in hindsight....
export const useUpsertDocs = (collectionName: string) => {
  const firestore = useFirestore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dataArg: any[]) => {
      const docRefs: string[] = [];

      // Iterate over the array of IDs
      for (const data of dataArg) {
        let docRef;

        // If an ID is provided, use it, otherwise create a reference with a new ID
        if (data.documentId) {
          docRef = doc(firestore, collectionName, data.documentId);
        } else {
          docRef = doc(collection(firestore, collectionName)); // Automatically generates a new ID
        }

        const docSnap = await getDoc(docRef);

        // Check if the document exists and upsert accordingly
        if (docSnap.exists()) {
          console.log('exists');
          await setDoc(docRef, data, { merge: true });
        } else {
          console.log('exists');
          await setDoc(docRef, data);
        }

        docRefs.push(docRef.id); // Collect the document reference IDs
      }

      return docRefs; // Return all created or updated document IDs
    },
    onSuccess: () => {
      // Invalidate queries when mutation is successful
      queryClient.invalidateQueries({ queryKey: ['useGetDocsData', collectionName] });
      queryClient.invalidateQueries({ queryKey: ['useGetDocData', collectionName] });
    },
  });
};
