import { GetSelectedCropsResult } from '~/types/chunkData';

export interface LabelFormInputs {
  selectedCrops: Array<GetSelectedCropsResult>;
  inputs: Record<string, string>;
  confidences: Record<string, number>;
}

export const setErrorsGivenInputAndConfidence = (
  src: LabelFormInputs,
  setErrors: (update: (prev: Record<string, string>) => Record<string, string>) => void,
) => {
  // Checking missing inputs and empty values
  const missingInputs = src.selectedCrops.filter((crop) => {
    const inputValue = src.inputs[crop.cropId];
    return !inputValue || inputValue.trim() === ''; // Empty strings or undefined
  });

  missingInputs.forEach((crop) => {
    setErrors((prev) => ({
      ...prev,
      [crop.cropId]: 'Missing math input',
    }));
  });

  // If we found missing inputs, no need to check for missing confidence
  if (missingInputs.length > 0) return false;

  // Checking missing confidence ratings
  const missingConfidence = src.selectedCrops.filter((crop) => !src.confidences[crop.cropId]);

  missingConfidence.forEach((crop) => {
    setErrors((prev) => ({
      ...prev,
      [crop.cropId]: 'Missing confidence rating',
    }));
  });

  // If missing inputs or missing confidence exist, return false
  if (missingConfidence.length > 0) return false;

  return true;
};

export interface CombinedFormData extends GetSelectedCropsResult {
  parsedInput: string;
  parsedInputConfidence: number;
}

export const getCombinedLabelFormData = (src: LabelFormInputs): Record<string, CombinedFormData> => {
  return Object.fromEntries(
    src.selectedCrops.map((crop) => [
      crop.cropId,
      { ...crop, parsedInput: src.inputs[crop.cropId], parsedInputConfidence: src.confidences[crop.cropId] },
    ]),
  );
};
