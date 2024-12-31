import Papa from 'papaparse';
import React, { useState } from 'react';
import { useUpsertDoc } from '~/lib/firestore';

interface CsvRow {
  id: string;
  image_url: string;
}

export const UploadData: React.FC = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadCsvRowMutation = useUpsertDoc('jobs', true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      setError(null); // Clear previous errors
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
              imageUrl: row.image_url,
            });
          }

          setIsUploading(false);
          alert('CSV data uploaded successfully!');
        },
        header: true, // Assumes the first row contains headers
        skipEmptyLines: true,
      });
    } catch (error) {
      setError('Error uploading CSV data.');
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-full p-8">
      <h1 className="text-3xl font-bold mb-2">Upload CSV to be Labelled</h1>
      <div className="flex gap-4 justify-center my-8">
        <input type="file" accept=".csv" onChange={handleFileChange} />
        {error && <p className="text-red-500">{error}</p>}
        <button onClick={handleUpload} disabled={isUploading} className="btn btn-primary">
          {isUploading ? 'Uploading...' : 'Upload CSV'}
        </button>
      </div>
    </div>
  );
};

export default UploadData;
