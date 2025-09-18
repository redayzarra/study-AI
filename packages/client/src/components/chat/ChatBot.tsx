import axios from "axios";
import { useRef, useState } from "react";
import ChatInput, { type ChatFormData } from "./ChatInput";
import ChatMessages, { type Message } from "./ChatMessages";
import TypingIndicator from "./TypingIndicator";
import popSound from "@/assets/sounds/pop.mp3";
import notificationSound from "@/assets/sounds/notification.mp3";

type ChatResponse = {
    message: string;
};

const popAudio = new Audio(popSound);
popAudio.volume = 0.5;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.3;

const ChatBot = () => {
    // Create a conversationId using crypto (available in all browsers) using "useRef" since this is constant
    const conversationId = useRef(crypto.randomUUID());

    // Create messages using useState, initialize to an empty array
    const [messages, setMessages] = useState<Message[]>([]);

    // Create a state to check if the bot is typing
    const [isTyping, setIsTyping] = useState(false);

    // Create a state to track any errors that we may encounter
    const [error, setError] = useState("");

    // onSubmit Function: Starts by resetting the chat and then calls the backend
    const onSubmit = async ({ prompt }: ChatFormData) => {
        try {
            popAudio.play();

            // Add the prompt from the user to the messages, set typing to true and reset the error
            setMessages((prev) => [...prev, { content: prompt, role: "User" }]);
            setIsTyping(true);
            setError("");

            // Send the prompt to the backend
            const { data } = await axios.post<ChatResponse>("/api/chat", {
                prompt,
                conversationId: conversationId.current,
            });

            // Add the message bot's response from the backend to the messages
            setMessages((prev) => [
                ...prev,
                { content: data.message, role: "Bot" },
            ]);

            notificationAudio.play();
        } catch (error) {
            // Log the error and set the error state so we can display it
            console.error(error);
            setError("Something went wrong, please try again!");
        } finally {
            // After any operation, always set typing back to false
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto scroll-smooth">
                <ChatMessages messages={messages} />
                {isTyping && <TypingIndicator />}
                {error && <p className="text-red-400">{error}</p>}
            </div>
            <ChatInput onSubmit={onSubmit} />
        </div>
    );
};

export default ChatBot;
