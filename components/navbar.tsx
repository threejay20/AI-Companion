// Import necessary modules and components
"use client";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";

// Define the 'Navbar' component to display the navigation bar
const font = Poppins({ weight: "600", subsets: ["latin"] });

// Define the 'Navbar' component that displays the navigation bar
interface NavbarProps {
  isPro: boolean; // Indicates if the user is a Pro member
}

export const Navbar = ({ isPro }: NavbarProps) => {
  const proModal = useProModal(); // Hook for handling the Pro subscription modal

  return ( 
    <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 h-16 border-b border-primary/10 bg-secondary">
      <div className="flex items-center">
        <MobileSidebar isPro={isPro} /> {/* Display the mobile sidebar component */}
        <Link href="/">
          <h1 className={cn("hidden md:block text-xl md:text-3xl font-bold text-primary", font.className)}>
            companion.ai {/* Display the site title */}
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-x-3">
        {!isPro && (
          // Display the "Upgrade" button with a Pro modal trigger if the user is not a Pro member
          <Button onClick={proModal.onOpen} size="sm" variant="premium">
            Upgrade
            <Sparkles className="h-4 w-4 fill-white text-white ml-2" /> {/* Display sparkles next to the "Upgrade" button */}
          </Button>
        )}
        <ModeToggle /> {/* Display the mode toggle component for light/dark mode switch */}
        <UserButton afterSignOutUrl="/" /> {/* Display the user button, allowing sign-in/sign-out functionality */}
      </div>
    </div>
  );
}
