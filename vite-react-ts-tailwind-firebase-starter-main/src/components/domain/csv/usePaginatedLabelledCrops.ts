import { useEffect, useState } from 'react';
import { useGetPaginatedDocs } from '~/lib/firestore';

const PAGE_SIZE = 10;

export function usePaginatedLabelledCrops() {
  const [pageNumber, setPageNumber] = useState(0);
  const [lastDocs, setLastDocs] = useState<any[]>([]);
  const [allDocs, setAllDocs] = useState<any[]>([]);

  // I was unable to figure out composite indexes and querying quickly enough, so I am
  // just doing it in memory for now, which is a bad practice typically.
  const { data, isLoading, isError } = useGetPaginatedDocs(
    'chunks',
    'uploadDate',
    pageNumber,
    PAGE_SIZE,
    lastDocs[lastDocs.length - 1],
    // orderBy('parsedInput'),
    // where('parsedInput', '!=', ''),
  );

  const labelledCropsData = data?.documents?.filter((doc) => !!doc.parsedInput && !!doc.parsedInputConfidence) || [];
  const isLastPage = labelledCropsData.length < PAGE_SIZE || !data?.lastVisible;

  useEffect(() => {
    // Load in query data to internal state
    if (!isLoading && labelledCropsData.length > 0) {
      setAllDocs((prev) => {
        const uniqueDocs = labelledCropsData.filter(
          (newDoc) => !prev.some((existingDoc) => existingDoc.documentId === newDoc.documentId),
        );
        return [...prev, ...uniqueDocs];
      });
    }
  }, [isLoading, pageNumber]);

  const nextPage = () => {
    if (data?.lastVisible) {
      setLastDocs((prev) => [...prev, data.lastVisible]);
      setPageNumber((prev) => (prev += 1));
    }
  };

  return {
    labelledCropsData: allDocs,
    isLabelledCropsLoading: isLoading,
    isLabelledCropsError: isError,
    nextPage,
    isLastPage,
  };
}
