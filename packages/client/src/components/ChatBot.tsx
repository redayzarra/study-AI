import { FaArrowUp } from "react-icons/fa6";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";

type FormData = {
    prompt: string;
};

const ChatBot = () => {
    const { register, handleSubmit, reset, formState } = useForm<FormData>({});

    const onSubmit = (data: FormData) => {
        console.log(data);
        reset();
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        git;
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
