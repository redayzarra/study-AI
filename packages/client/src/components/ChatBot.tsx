import { FaArrowUp } from "react-icons/fa6";
import { Button } from "./ui/button";
import axios from "axios";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { useRef } from "react";

type FormData = {
    prompt: string;
};

const ChatBot = () => {
    // Create a conversationId using crypto (available in all browsers) using "useRef" since this is constant
    const conversationId = useRef(crypto.randomUUID());

    // Extract helpful functions from React.useForm
    const { register, handleSubmit, reset, formState } = useForm<FormData>({});

    // onSubmit Function: Starts by resetting the chat and then calls the backend
    const onSubmit = async ({ prompt }: FormData) => {
        reset();
        const { data } = await axios.post("/api/chat", {
            prompt,
            conversationId: conversationId.current,
        });
        console.log(data);
    };

    // onKeyDown: Allows users to click enter to call onSubmit
    const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
        >
            <Textarea
                {...register("prompt", {
                    required: true,
                    validate: (data) => data.trim().length > 0,
                })}
                className="w-full border-0 focus-visible:ring-0 resize-none shadow-none"
                placeholder="Ask me anything..."
                maxLength={1000}
            />
            <Button
                disabled={!formState.isValid}
                className="rounded-full cursor-pointer shadow-sm w-9 h-9"
            >
                <FaArrowUp className="" />
            </Button>
        </form>
    );
};

export default ChatBot;
