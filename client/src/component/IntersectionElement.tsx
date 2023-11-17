import { useEffect, useRef } from "react";

interface IntersectionElementProps {
  onIntersect: () => void;
}

export const IntersectionElement = (props: IntersectionElementProps) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const { onIntersect } = props;
  useEffect(() => {
    if (!elementRef.current) {
      throw new Error("Intersection Element: elementRef is not defined");
    }
    if (!observer.current) {
      observer.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        });
      });
    }
    observer.current.observe(elementRef.current);

    return () => observer.current?.disconnect();
  }, [onIntersect]);

  return (
    <div ref={elementRef} className="w-full h-1">
      Intersect
    </div>
  );
};
