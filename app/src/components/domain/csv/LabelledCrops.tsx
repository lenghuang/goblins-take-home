import { downloadCSV } from '~/lib/csv';
import { formatFirestoreTimestampAgo } from '~/lib/dates';
import { usePaginatedLabelledCrops } from './usePaginatedLabelledCrops';

const Buttons = ({ labelledCropsData = [], nextPage = () => {}, isLastPage = false, forceDisabled = false }) => (
  <div className="flex justify-end gap-4">
    <button onClick={nextPage} className="btn" disabled={forceDisabled || isLastPage}>
      Load More
    </button>
    <button
      disabled={forceDisabled}
      onClick={() => downloadCSV(labelledCropsData, 'whiteBoardLabels.csv')}
      className="btn btn-primary text-white"
    >
      Download {labelledCropsData.length} Rows As CSV
    </button>
  </div>
);

export function LabelledCrops() {
  const { labelledCropsData, isLabelledCropsLoading, isLabelledCropsError, nextPage, isLastPage } =
    usePaginatedLabelledCrops();

  if (isLabelledCropsLoading)
    return (
      <>
        <div className="flex flex-row justify-between mb-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Download Labelled Data</h2>
            <p>View and confirm the data that you'd like to download below.</p>
          </div>
          <Buttons forceDisabled={true} />
        </div>

        <p>Loading...</p>
      </>
    );

  if (isLabelledCropsError)
    return (
      <>
        <div className="flex flex-row justify-between mb-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Download Labelled Data</h2>
            <p>View and confirm the data that you'd like to download below.</p>
          </div>
          <Buttons forceDisabled={true} />
        </div>
        <p className="text-error">Error loading labels</p>
      </>
    );

  return (
    <>
      <div className="flex flex-row justify-between mb-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Download Labelled Data</h2>
          <p>View and confirm the data that you'd like to download below.</p>
        </div>
        <Buttons labelledCropsData={labelledCropsData as never[]} isLastPage={isLastPage} nextPage={nextPage} />
      </div>

      <div className="overflow-x-auto w-screen absolute left-0">
        <table className="table table-fixed min-w-320">
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
            {labelledCropsData.map((label, index) => {
              const { documentId, croppedImageSrc, parsedInput, parsedInputConfidence, uploadedBy, uploadDate } = label;
              return (
                <tr key={`table_row_${index}_${documentId}`}>
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
    </>
  );
}
