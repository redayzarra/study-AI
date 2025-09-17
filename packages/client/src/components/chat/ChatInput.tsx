import { useForm } from "react-hook-form";
import { FaArrowUp } from "react-icons/fa6";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export type ChatFormData = {
    prompt: string;
};

type ChatInputProps = {
    onSubmit: (data: ChatFormData) => void;
};

const ChatInput = ({ onSubmit }: ChatInputProps) => {
    // Extract helpful functions from React.useForm
    const { register, handleSubmit, reset, formState } = useForm<ChatFormData>(
        {}
    );

    // handleKeyDown: Allows users to click enter to call onSubmit
    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
        }
    };

    // submit: Responsible for handling the submission which resets and calls onSubmit
    const submit = handleSubmit((data) => {
        reset({ prompt: "" });
        onSubmit(data);
    });

    return (
        <form
            onSubmit={submit}
            onKeyDown={handleKeyDown}
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
    );
};

export default ChatInput;
