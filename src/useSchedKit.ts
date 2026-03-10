import { useCallback, useState } from 'react';

export interface SchedKitState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Hook for programmatic control of a SchedKit overlay.
 * Pair with <SchedKitEmbed mode="popup" ref={ref} /> and call ref.open() / ref.close(),
 * or use the returned open/close to drive your own trigger UI.
 */
export function useSchedKit(): SchedKitState {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  return { isOpen, open, close, toggle };
}
