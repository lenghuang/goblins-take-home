import { useEffect, useState } from 'react';
import { downloadCSV } from '~/lib/csv';
import { formatFirestoreTimestampAgo } from '~/lib/dates';
import { useGetPaginatedDocs } from '~/lib/firestore';

const PAGE_SIZE = 5;

function usePaginatedLabelledCrops() {
  const [pageNumber, setPageNumber] = useState(0);
  const [lastDocs, setLastDocs] = useState<any[]>([]);
  const [allDocs, setAllDocs] = useState<any[]>([]);

  // I was unable to figure out composite indexes and querying quickly enough, so I am
  // just doing it in memory for now, which is a bad practice typically.
  const { data, isLoading, isError } = useGetPaginatedDocs(
    'chunks',
    'documentId',
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
      setAllDocs((prev) => [...prev, ...labelledCropsData]);
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

export default function LabelledCropsPage() {
  const { labelledCropsData, isLabelledCropsLoading, isLabelledCropsError, nextPage, isLastPage } =
    usePaginatedLabelledCrops();

  if (isLabelledCropsLoading) return <div>Loading...</div>;
  if (isLabelledCropsError) return <div>Error loading labelled crops.</div>;

  return (
    <div>
      <div className="p-8 flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Download Labelled Data</h2>
        <p>View and confirm the data that you'd like to download below.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-fixed min-w-full">
          <thead>
            <tr>
              <th className="w-1/12">Document Id</th>
              <th className="w-2/12">ImageURL</th>
              <th className="w-1/12">Image</th>
              <th className="w-4/12">Math Input</th>
              <th className="w-1/12">Confidence</th>
              <th className="w-2/12">Uploaded By</th>
              <th className="w-1/12">Upload Date</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(labelledCropsData).map((label, index) => {
              const { documentId, croppedImageSrc, parsedInput, parsedInputConfidence, uploadedBy, uploadDate } = label;
              return (
                <tr key={`table_row_${documentId}`}>
                  <td>
                    <div className="break-all line-clamp-3 overflow-hidden text-ellipsis">{documentId}</div>
                  </td>
                  <td>
                    <div className="break-all line-clamp-3 overflow-hidden text-ellipsis">{croppedImageSrc}</div>
                  </td>
                  <td>
                    <div className="break-all line-clamp-3 overflow-hidden text-ellipsis">
                      <img className="contain" src={croppedImageSrc} />
                    </div>
                  </td>
                  <td>
                    <div className="break-all line-clamp-3 overflow-hidden text-ellipsis">
                      <code>{parsedInput}</code>
                    </div>
                  </td>
                  <td>
                    <div className="break-all line-clamp-3 overflow-hidden text-ellipsis">{parsedInputConfidence}</div>
                  </td>
                  <td>
                    <div className="break-all line-clamp-3 overflow-hidden text-ellipsis">{uploadedBy}</div>
                  </td>
                  <td>
                    <div className="break-all line-clamp-3 overflow-hidden text-ellipsis">
                      {formatFirestoreTimestampAgo(uploadDate)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button onClick={nextPage} className="btn btn-primary" disabled={isLastPage}>
          Load More
        </button>
        <button onClick={() => downloadCSV(labelledCropsData, 'whiteBoardLabels.csv')} className="btn btn-secondary">
          Download As CSV
        </button>
      </div>
    </div>
  );
}
