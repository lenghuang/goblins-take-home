import { Timestamp } from 'firebase/firestore';
import moment from 'moment';

export const formatFirestoreTimestampAgo = (timestamp: Timestamp): string => {
  // Convert Firestore Timestamp to JavaScript Date
  const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds

  // Use moment.js to get the "time ago" format
  return moment(date).fromNow();
};
