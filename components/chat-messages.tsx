// Import necessary dependencies
"use client"
import { Companion } from "@prisma/client"; // Importing Companion type from Prisma client
import { ChatMessage, ChatMessageProps } from "./chat-message"; // Importing ChatMessage component and ChatMessageProps type
import { ElementRef, useEffect, useRef, useState } from "react"; // Importing React dependencies

// Define the props interface for the ChatMessages component
interface ChatMessagesProps {
    messages: ChatMessageProps[]; // Array of chat messages
    isLoading: boolean; // Loading state
    companion: Companion; // Companion data
}

// Create the ChatMessages component using props destructuring
export const ChatMessages = ({
    messages = [], // Default to an empty array if no messages provided
    isLoading, // Loading state
    companion // Companion data
}: ChatMessagesProps) => {
    // Create a reference to a DOM element to control scrolling
    const scrollRef = useRef<ElementRef<"div">>(null);

    // Create a state variable to simulate loading messages
    const [fakeLoading, setFakeLoading] = useState(messages.length === 0 ? true : false);

    // Use an effect to turn off fake loading after 1 second
    useEffect(() => {
        const timeout = setTimeout(() => {
            setFakeLoading(false);
        }, 1000);

        // Cleanup function to clear the timeout when the component unmounts
        return () => {
            clearTimeout(timeout);
        }
    }, []);

    // Use an effect to scroll to the bottom when new messages arrive
    useEffect(() => {
        scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    // Render the ChatMessages component
    return (
        <div className="flex-1 overflow-y-auto pr-4 ">
            {/* Render a system message introducing the companion */}
            <ChatMessage
                isLoading={fakeLoading}
                src={companion.src}
                role="system"
                content={`Hello, I am ${companion.name}, ${companion.description}`}
            />

            {/* Map through messages and render ChatMessage components for each */}
            {messages.map((message) => (
                <ChatMessage
                    key={message.content}
                    role={message.role}
                    content={message.content}
                    src={message.src}
                />
            ))}

            {/* Render a loading message if isLoading is true */}
            {isLoading && (
                <ChatMessage
                    role="system"
                    src={companion.src}
                    isLoading
                />
            )}

            {/* Create a reference div for scrolling */}
            <div ref={scrollRef} />
        </div>
    );
}
