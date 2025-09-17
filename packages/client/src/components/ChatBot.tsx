import { FaArrowUp } from "react-icons/fa6";
import { Button } from "./ui/button";
import axios from "axios";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type FormData = {
    prompt: string;
};

type ChatResponse = {
    message: string;
};

type Message = {
    content: string;
    role: "User" | "Bot";
};

const ChatBot = () => {
    // Create messages using useState, initialize to an empty array
    const [messages, setMessages] = useState<Message[]>([]);

    // Create a state to check if the bot is typing
    const [isTyping, setIsTyping] = useState(false);

    // Create a state to track any errors that we may encounter
    const [error, setError] = useState("");

    // Adding new variable to track the latest message and auto-scroll
    const lastMessageRef = useRef<HTMLDivElement | null>(null);

    // Create a conversationId using crypto (available in all browsers) using "useRef" since this is constant
    const conversationId = useRef(crypto.randomUUID());

    // Extract helpful functions from React.useForm
    const { register, handleSubmit, reset, formState } = useForm<FormData>({});

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // onSubmit Function: Starts by resetting the chat and then calls the backend
    const onSubmit = async ({ prompt }: FormData) => {
        try {
            setMessages((prev) => [...prev, { content: prompt, role: "User" }]);
            setIsTyping(true);
            setError("");

            reset({ prompt: "" });

            const { data } = await axios.post<ChatResponse>("/api/chat", {
                prompt,
                conversationId: conversationId.current,
            });

            setMessages((prev) => [
                ...prev,
                { content: data.message, role: "Bot" },
            ]);
        } catch (error) {
            console.error(error);
            setError("Something went wrong, please try again!");
        } finally {
            setIsTyping(false);
        }
    };

    // onKeyDown: Allows users to click enter to call onSubmit
    const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    // onCopyMessage: Allow users to cleanly copy messages from our UI without fuss
    const onCopyMessage = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
        const selection = window.getSelection()?.toString().trim();
        if (selection) {
            e.preventDefault();
            e.clipboardData.setData("text/plain", selection);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto scroll-smooth">
                {messages.map((message, index) => (
                    <div
                        className={`px-3 py-1 rounded-xl ${
                            message.role === "User"
                                ? "bg-blue-500 text-white self-end max-w-xl"
                                : "text-black"
                        }`}
                        onCopy={onCopyMessage}
                        key={index}
                        ref={
                            index === messages.length - 1
                                ? lastMessageRef
                                : null
                        }>
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex self-start gap-1 px-3 py-3 bg-gray-200 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-gray-600 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-600 animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-600 animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                )}
                {error && <p className="text-red-400">{error}</p>}
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                onKeyDown={onKeyDown}
                className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl">
                <Textarea
                    {...register("prompt", {
                        required: true,
                        validate: (data) => data.trim().length > 0,
                    })}
                    className="w-full border-0 focus-visible:ring-0 resize-none shadow-none"
                    placeholder="Ask me anything..."
                    maxLength={1000}
                    autoFocus
                />
                <Button
                    disabled={!formState.isValid}
                    className="rounded-full cursor-pointer shadow-sm w-9 h-9">
                    <FaArrowUp className="" />
                </Button>
            </form>
        </div>
    );
};

export default ChatBot;
