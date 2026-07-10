import { useEffect, useRef } from "react";
import { useUpdateReceipt } from "../update/useUpdateReceipt";

interface UseSeenObserverProps {
  messageId: string;
  isOwn: boolean;
  seen: boolean;
}

export function useSeenObserver({
  messageId,
  isOwn,
  seen,
}: UseSeenObserverProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const updateReceipt = useUpdateReceipt();
  const hasMarkedSeen = useRef(false);
  useEffect(() => {
    if (seen) {
      hasMarkedSeen.current = true;
    }
  }, [seen]);
  useEffect(() => {
    if (isOwn || seen || !ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry.isIntersecting) {
          return;
        }

        if (hasMarkedSeen.current) {
          return;
        }

        hasMarkedSeen.current = true;

        updateReceipt.mutate({
          messageId,
          status: "seen",
        });

        observer.disconnect();
      },
      {
        threshold: 0.6,
      },
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [messageId, isOwn, seen]);
  return ref;
}
