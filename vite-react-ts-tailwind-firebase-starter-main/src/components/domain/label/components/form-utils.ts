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
  const inputKeys = Object.keys(src.inputs);
  if (src.selectedCrops.length !== inputKeys.length) {
    const difference = src.selectedCrops.filter((x) => !inputKeys.includes(x.cropId));
    difference.forEach((x) => setErrors((prev) => ({ ...prev, [x.cropId]: 'Missing math input' })));
    return false;
  }

  const confidenceKeys = Object.keys(src.confidences);
  if (src.selectedCrops.length !== confidenceKeys.length) {
    const difference = src.selectedCrops.filter((x) => !confidenceKeys.includes(x.cropId));
    difference.forEach((x) => setErrors((prev) => ({ ...prev, [x.cropId]: 'Missing confidence rating' })));
    return false;
  }

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
