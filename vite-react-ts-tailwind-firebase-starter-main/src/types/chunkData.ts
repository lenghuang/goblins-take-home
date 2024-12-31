import { Timestamp } from 'firebase/firestore';

export interface GetSelectedCropsResult {
  cropId: string;
  uploadedBy: string;
  uploadDate: Timestamp;
  croppedImageSrc: string;
}
