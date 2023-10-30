import { create } from 'zustand';

// Define an interface to specify the shape of the state managed by the 'useProModal' store
interface useProModalStore {
  isOpen: boolean;      // Indicates whether the modal is open or closed
  onOpen: () => void;   // Function to open the modal
  onClose: () => void;  // Function to close the modal
}

// Create a Zustand store named 'useProModal' to manage the modal state
export const useProModal = create<useProModalStore>((set) => ({
  // Initialize the store state with 'isOpen' set to 'false' and define 'onOpen' and 'onClose' functions
  isOpen: false,           // The modal is initially closed
  onOpen: () => set({ isOpen: true }),   // Function to set 'isOpen' to 'true' (open the modal)
  onClose: () => set({ isOpen: false }), // Function to set 'isOpen' to 'false' (close the modal)
}));
