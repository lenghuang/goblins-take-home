import React from 'react';
import { UploadCsv } from '../domain/csv/UploadCsv';
import { Container } from '../shared/Container';
import { Head } from '../shared/Head';

export const UploadData: React.FC = () => {
  return (
    <>
      <Head title="Upload" />
      <Container>
        <h1 className="text-3xl font-bold mb-2">Upload CSV</h1>
        <p>
          Upload a CSV file that has the data you want labelled. Note that the format of your CSV must be:{' '}
          <code className="bg-base-200 rounded-xl px-2 py-1">id,image_url</code>
        </p>
        <UploadCsv />
      </Container>
    </>
  );
};

export default UploadData;
