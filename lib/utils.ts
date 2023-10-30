// Import necessary modules and functions from external libraries
import { type ClassValue, clsx } from "clsx"; // Importing 'ClassValue' type and 'clsx' function from 'clsx' library
import { twMerge } from "tailwind-merge"; // Importing 'twMerge' function from 'tailwind-merge' library

// Define a function called 'cn' for generating CSS class names
export function cn(...inputs: ClassValue[]) {
  // The 'cn' function takes a variable number of 'ClassValue' inputs as arguments and returns a string
  // It combines and merges the input class names using 'clsx' from the 'clsx' library
  return twMerge(clsx(inputs));
}

// Define a function called 'absoluteUrl' for generating absolute URLs
export function absoluteUrl(path: string) {
  // The 'absoluteUrl' function takes a 'path' string as an argument and returns an absolute URL
  // It combines the 'path' with the 'NEXT_PUBLIC_APP_URL' environment variable to create the absolute URL
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}
