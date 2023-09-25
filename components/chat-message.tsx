// Import necessary dependencies and components
"use client";
import { BeatLoader } from "react-spinners"; // Loading spinner component
import { Copy } from "lucide-react"; // Copy icon component
import { useTheme } from "next-themes"; // Theme management hook

import { cn } from "@/lib/utils"; // Utility function for CSS class names
import { BotAvatar } from "@/components/bot-avatar"; // Bot avatar component
import { UserAvatar } from "@/components/user-avatar"; // User avatar component
import { Button } from "@/components/ui/button"; // Button component
import { useToast } from "@/components/ui/use-toast"; // Toast notification hook

// Define the props interface for the ChatMessage component
export interface ChatMessageProps {
  role: "system" | "user"; // Role of the message (system or user)
  content?: string; // Message content
  isLoading?: boolean; // Loading state
  src?: string; // Source (e.g., avatar image URL)
}

// Create the ChatMessage component using props destructuring
export const ChatMessage = ({
  role, // Role of the message
  content, // Message content
  isLoading, // Loading state
  src // Source (e.g., avatar image URL)
}: ChatMessageProps) => {
  // Access the toast function for displaying notifications
  const { toast } = useToast();
  // Access the current theme (light or dark) using the useTheme hook
  const { theme } = useTheme();

  // Function to handle copying message content to the clipboard
  const onCopy = () => {
    if (!content) {
      return;
    }

    // Use the Clipboard API to write the message content to the clipboard
    navigator.clipboard.writeText(content);

    // Display a toast notification confirming the message was copied
    toast({
      description: "Message copied to clipboard.",
      duration: 3000,
    });
  };

  return (
    // Render the chat message container with appropriate styling based on role
    <div className={cn(
      "group flex items-start gap-x-3 py-4 w-full",
      role === "user" && "justify-end"
    )}>
      {/* Display the bot's avatar if the role is not "user" and a source (src) is provided */}
      {role !== "user" && src && <BotAvatar src={src} />}
      {/* Display the message content within a rounded box */}
      <div className="rounded-md px-4 py-2 max-w-sm text-sm bg-primary/10">
        {isLoading 
          ? <BeatLoader color={theme === "light" ? "black" : "white"} size={5} /> // Show a loading spinner when isLoading is true
          : content // Show the message content when isLoading is false
        }
      </div>
      {/* Display the user's avatar if the role is "user" */}
      {role === "user" && <UserAvatar />}
      {/* Display a copy button for non-user messages that are not in a loading state */}
      {role !== "user" && !isLoading && (
        <Button 
          onClick={onCopy} 
          className="opacity-0 group-hover:opacity-100 transition" 
          size="icon"
          variant="ghost"
        >
          <Copy className="w-4 h-4" /> {/* Display the copy icon */}
        </Button>
      )}
    </div>
  );
}
