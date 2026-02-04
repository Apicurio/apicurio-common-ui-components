import { useEffect, useRef, useState } from "react";

/**
 * A custom hook that observes the size of an element using the ResizeObserver API.
 *
 * @param options - Configuration options for the resize observer
 * @param options.onResize - Callback function called when the element resizes
 * @returns An object containing the ref to attach to the element and its current dimensions
 */
export function useResizeObserver<T extends HTMLElement = HTMLElement>(options?: {
    onResize?: (size: { width?: number; height?: number }) => void;
}) {
    const ref = useRef<T>(null);
    const [size, setSize] = useState<{ width?: number; height?: number }>({});
    const onResizeRef = useRef(options?.onResize);

    useEffect(() => {
        onResizeRef.current = options?.onResize;
    }, [options?.onResize]);

    useEffect(() => {
        const element = ref.current;
        if (!element) {
            return;
        }

        const resizeObserver = new ResizeObserver((entries) => {
            if (!entries[0]) {
                return;
            }

            const { width, height } = entries[0].contentRect;
            const newSize = { width, height };

            setSize(newSize);
            onResizeRef.current?.(newSize);
        });

        resizeObserver.observe(element);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return { ref, width: size.width, height: size.height };
}
