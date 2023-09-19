import { useEffect, useState } from "react";

// A custom hook that debounces a value to reduce the frequency of updates.
// It returns a debounced value that reflects the latest input value after a specified delay.
export function useDebounce<T>(value: T, delay?: number): T {
    // State to hold the debounced value
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    // Effect hook to set up the debouncing mechanism
    useEffect(() => {
        // Create a timer that updates the debounced value after the specified delay
        const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

        // Cleanup function that clears the timer when the component unmounts or when the dependencies change
        return () => {
            clearTimeout(timer); // Clear the timer to prevent unnecessary updates
        }

    }, [value, delay]); // Depend on 'value' and 'delay' to trigger the effect

    // Return the debounced value, which reflects the latest 'value' after the delay
    return debouncedValue;
}




