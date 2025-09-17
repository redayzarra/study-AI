import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export type Message = {
    content: string;
    role: "User" | "Bot";
};

type ChatMessageProps = {
    messages: Message[];
};

const ChatMessages = ({ messages }: ChatMessageProps) => {
    // onCopyMessage: Allow users to cleanly copy messages from our UI without fuss
    const onCopyMessage = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
        const selection = window.getSelection()?.toString().trim();
        if (selection) {
            e.preventDefault();
            e.clipboardData.setData("text/plain", selection);
        }
    };

    // Auto-scoll to the lastMessageRef which scrolls to the last message in the chat
    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Adding new variable to track the latest message and auto-scroll
    const lastMessageRef = useRef<HTMLDivElement | null>(null);

    return (
        <div className="flex flex-col gap-3">
            {messages.map((message, index) => (
                <div
                    className={`px-3 py-1 rounded-xl ${
                        message.role === "User"
                            ? "bg-blue-500 text-white self-end max-w-xl"
                            : "text-black"
                    }`}
                    onCopy={onCopyMessage}
                    key={index}
                    ref={index === messages.length - 1 ? lastMessageRef : null}>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
            ))}
        </div>
    );
};

export default ChatMessages;
