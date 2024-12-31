import { useState } from 'react';
import { formatFirestoreTimestampAgo } from '~/lib/dates';
import { useGetPaginatedDocs } from '~/lib/firestore';

function usePaginatedLabelledCrops() {
  const [pageNumber, setPageNumber] = useState(0);
  const [lastDocs, setLastDocs] = useState<any[]>([]); // Stack of lastDocs

  // I was unable to figure out composite indexes and querying quickly enough, so I am
  // just doing it in memory for now, which is a bad practice typically.
  const { data, isLoading, isError } = useGetPaginatedDocs(
    'chunks',
    'documentId',
    pageNumber,
    20,
    lastDocs[lastDocs.length - 1],
    // orderBy('parsedInput'),
    // where('parsedInput', '!=', ''),
  );

  const labelledCropsData = data?.documents || [];
  const isLastPage = labelledCropsData.length < 6 || !data?.lastVisible;

  // Go to the previous page
  const prevPage = () => {
    if (lastDocs.length === 0) return;
    setLastDocs(lastDocs.slice(0, -1));
    setPageNumber((prev) => prev - 1);
  };

  // Go to the next page
  const nextPage = () => {
    if (data?.lastVisible) {
      setLastDocs((prev) => [...prev, data.lastVisible]);
      setPageNumber((prev) => prev + 1);
    }
  };

  return {
    labelledCropsData,
    isLabelledCropsLoading: isLoading,
    isLabelledCropsError: isError,
    prevPage,
    nextPage,
    pageNumber,
    isLastPage,
  };
}

export default function LabelledCropsPage() {
  const {
    labelledCropsData,
    isLabelledCropsLoading,
    isLabelledCropsError,
    prevPage,
    nextPage,
    pageNumber,
    isLastPage,
  } = usePaginatedLabelledCrops();

  if (isLabelledCropsLoading) return <div>Loading...</div>;
  if (isLabelledCropsError) return <div>Error loading labelled crops.</div>;

  return (
    <div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {labelledCropsData?.map((doc) => (
          <div key={doc.documentId} className="border card card-compact w-full bg-base-100 shadow-xl">
            <figure className="border-b">
              <img src={doc.croppedImageSrc} className="object-contain w-full h-48" />
            </figure>
            <div className="card-body card-action">
              <p>{doc.uploadedBy}</p>
              <p>{formatFirestoreTimestampAgo(doc.uploadDate)}</p>
              <p>{doc.parsedInput}</p>
              <p>{doc.parsedInputConfidence}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-4 justify-center">
        <button onClick={prevPage} className="btn" disabled={pageNumber === 0}>
          Previous
        </button>
        <button onClick={nextPage} className="btn btn-primary" disabled={isLastPage}>
          Next
        </button>
      </div>
    </div>
  );
}
