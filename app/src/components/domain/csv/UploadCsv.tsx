import Papa from 'papaparse';
import React, { useEffect, useState } from 'react';
import { useUpsertDoc } from '~/lib/firestore';

interface CsvRow {
  id: string;
  image_url: string;
}

export const UploadCsv: React.FC = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<CsvRow[] | null>(null);
  const [parsedDataLength, setParsedDataLength] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadCsvRowMutation = useUpsertDoc('jobs', true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      setError(null); // Clear previous errors

      // Parse a preview of the CSV file
      Papa.parse(file, {
        complete: (result) => {
          const parsedData: CsvRow[] = result.data as CsvRow[];
          setCsvPreview(parsedData.slice(0, 5)); // Show only the first 5 rows
          setParsedDataLength(parsedData.length);
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };

  const handleUpload = async () => {
    if (!csvFile) {
      setError('Please select a CSV file first.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Parse CSV file using PapaParse
      Papa.parse(csvFile, {
        complete: async (result) => {
          const parsedData: CsvRow[] = result.data as CsvRow[];

          // Validate parsed data
          if (!parsedData.every((row) => row.id && row.image_url)) {
            setError('CSV is missing required fields (id, image_url).');
            setIsUploading(false);
            return;
          }

          // Upload each row to Firestore
          for (const row of parsedData) {
            uploadCsvRowMutation.mutate({
              documentId: row.id,
              whiteBoardId: row.id, // for querying
              imageUrl: row.image_url,
            });
          }

          setIsUploading(false);
        },
        header: true, // Assumes the first row contains headers
        skipEmptyLines: true,
      });
    } catch (error) {
      setError('Error uploading CSV data.');
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (!isUploading && !uploadCsvRowMutation.isPending && uploadCsvRowMutation.isSuccess)
      alert('CSV data uploaded successfully!');
  }, [alert, isUploading, uploadCsvRowMutation]);

  return (
    <div className="flex flex-col gap-4 justify-center items-center my-8">
      <div>
        <label htmlFor="csvInput" className="btn cursor-pointer">
          Choose File
        </label>
        <input id="csvInput" type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
        {csvFile && <span className="ml-4">{csvFile.name}</span>}
      </div>
      <div>
        <button onClick={handleUpload} disabled={isUploading} className="btn btn-primary text-white">
          {isUploading ? 'Uploading...' : 'Upload CSV'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>

      {csvPreview && (
        <div className="mt-4 flex flex-col items-center">
          <p className="mb-4">Previewing the first few rows. Total {parsedDataLength} rows.</p>

          <table className="table table-fixed w-4/5 text-sm">
            <thead>
              <tr>
                <th className="w-1/4">ID</th>
                <th className="w-3/4">Image URL</th>
              </tr>
            </thead>
            <tbody>
              {csvPreview.map((row, index) => (
                <tr key={index}>
                  <td>
                    <p className="break-all line-clamp-3 overflow-hidden text-ellipsis">{row.id}</p>
                  </td>
                  <td>
                    <p className="break-all line-clamp-3 overflow-hidden text-ellipsis">{row.image_url}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
