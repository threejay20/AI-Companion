"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useProModal } from "@/hooks/use-pro-modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

// Define the 'ProModal' component
export const ProModal = () => {
  // Initialize the 'proModal' state using the 'useProModal' custom hook
  const proModal = useProModal();
  
  // State variables to manage component behavior
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Access the 'toast' function for displaying messages
  const { toast } = useToast();

  // Effect hook to set 'isMounted' to 'true' when the component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Function to handle subscription and redirect to the Stripe checkout page
  const onSubscribe = async () => {
    try {
      setLoading(true);
      // Make an API request to retrieve the Stripe checkout URL
      const response = await axios.get("/api/stripe");
      // Redirect the user to the Stripe checkout page
      window.location.href = response.data.url;
    } catch (error) {
      // Handle any errors during the subscription process and show a toast message
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      // Reset the loading state
      setLoading(false);
    }
  }

  // If the component is not yet mounted, return null
  if (!isMounted) {
    return null;
  }

  // Render the ProModal component as a dialog with subscription details
  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center">
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription className="text-center space-y-2">
            Create
            <span className="text-sky-500 mx-1 font-medium"> Your Own Custom AI</span>
            Companions!
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex justify-between">
          <p className="text-2xl font-medium">
            $9<span className="text-sm font-normal">.99 / mo</span>
          </p>
          <Button onClick={onSubscribe} disabled={loading} variant="premium">
            Subscribe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
