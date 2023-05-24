import { NewMarker } from '../hooks/useMapbox';

export const instanceOfNewMarker = (
  object: Record<string, unknown>
): object is NewMarker => {
  return 'lat' in object;
};
