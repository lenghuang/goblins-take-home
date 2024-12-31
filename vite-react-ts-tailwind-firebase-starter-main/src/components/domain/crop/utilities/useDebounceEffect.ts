// Taken From https://github.com/sekoyo/react-image-crop

import { DependencyList, useEffect } from 'react';

export function useDebounceEffect(fn: () => void, waitTime: number, deps: DependencyList = []) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn.apply(undefined, deps as any); // Couldn't figure out type error here
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, deps);
}
