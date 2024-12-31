// Here, I realized I had to put down a credit card to upload images.
// Given the small scope of this project, I will opt to store base64 images as strings
// in my document storage (Google FireStore). This is a pretty bad design choice
// and will not scale well in terms of costs. But since this is just for a demo,
// I will do this for now. https://stackoverflow.com/a/73627641

// @see useUploadImageChunk();

import { getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage';

export const uploadImageToFirebase = async (imageDataUrl: string, id: string): Promise<string> => {
  // Get a reference to Firebase Storage
  const storage = getStorage();
  const storageRef = ref(storage, `crop_images/${id}`);

  // Upload the base64 image string to Firebase Storage
  await uploadString(storageRef, imageDataUrl, 'data_url');

  // Get the download URL of the uploaded image
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};
