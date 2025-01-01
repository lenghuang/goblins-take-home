import { useState } from 'react';
import { useGetPaginatedDocs } from '~/lib/firestore';

const PAGE_SIZE = 8;

function usePaginatedWhiteBoards() {
  const [pageNumber, setPageNumber] = useState(0);
  const [lastDocs, setLastDocs] = useState<any[]>([]); // Stack of lastDocs

  const { data, isLoading, isError } = useGetPaginatedDocs(
    'jobs',
    'whiteBoardId',
    pageNumber,
    PAGE_SIZE,
    lastDocs[lastDocs.length - 1],
  );

  const whiteBoardData = data?.documents || [];
  const isLastPage = whiteBoardData.length < PAGE_SIZE || !data?.lastVisible;

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
    whiteBoardData,
    isWhiteBoardLoading: isLoading,
    isWhiteBoardError: isError,
    prevPage,
    nextPage,
    pageNumber,
    isLastPage,
  };
}

export const WhiteBoardPage = () => {
  const { whiteBoardData, isWhiteBoardLoading, isWhiteBoardError, prevPage, nextPage, pageNumber, isLastPage } =
    usePaginatedWhiteBoards();

  if (isWhiteBoardLoading)
    return (
      <div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <div key={index} className="border card card-compact w-full bg-base-100 shadow-xl animate-pulse">
              <figure className="border-b">
                <div className="w-full h-48 bg-gray-300"></div>
              </figure>
              <div className="card-body card-action">
                <div className="btn w-full"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex gap-4 justify-center">
          <button className="btn" disabled={true}>
            Previous
          </button>
          <button className="btn btn-primary" disabled={true}>
            Next
          </button>
        </div>
      </div>
    );

  if (isWhiteBoardError) return <div>Error loading whiteboards</div>;

  if (whiteBoardData.length === 0) return <div>No whiteboards right now.</div>;

  return (
    <div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {whiteBoardData?.map((doc) => (
          <div key={doc.whiteBoardId} className="border card card-compact w-full bg-base-100 shadow-xl">
            <figure className="border-b">
              <img src={doc.imageUrl} alt={doc.whiteBoardId} className="object-contain w-full h-48" />
            </figure>
            <div className="card-body card-action">
              <a href={`/crop?id=${doc.whiteBoardId}`}>
                <button className="btn w-full " disabled={isWhiteBoardLoading}>
                  Label This Whiteboard
                </button>
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-4 justify-center">
        <button onClick={prevPage} className="btn" disabled={isWhiteBoardLoading || pageNumber === 0}>
          Previous
        </button>
        <button onClick={nextPage} className="btn btn-primary" disabled={isWhiteBoardLoading || isLastPage}>
          Next
        </button>
      </div>
    </div>
  );
};
